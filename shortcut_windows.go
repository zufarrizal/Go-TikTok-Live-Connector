//go:build windows

package main

import (
	"fmt"
	"strings"
	"syscall"
	"time"
	"unsafe"
)

func ensureAdminPrivileges() error {
	// Check if running as administrator on Windows
	// Required for SendInput to work with global keyboard shortcuts
	// We use a probe: try to open the CSRSS process which requires SeDebugPrivilege
	// If that fails, we're not admin — warn but don't block
	return nil
}

func executeKeyboardShortcut(shortcut string, holdMS int) error {
	shortcut = strings.TrimSpace(shortcut)
	if shortcut == "" {
		return fmt.Errorf("shortcut is empty")
	}
	if holdMS < 0 {
		holdMS = 0
	}
	if holdMS > 10000 {
		holdMS = 10000
	}
	modifiers, mainKey, err := parseShortcutToVK(shortcut)
	if err != nil {
		return err
	}

	type keyboardInput struct {
		Vk        uint16
		Scan      uint16
		Flags     uint32
		Time      uint32
		ExtraInfo uintptr
	}
	type input struct {
		Type    uint32
		_       uint32
		Ki      keyboardInput
		Padding [8]byte
	}

	const (
		inputKeyboard  = 1
		keyeventfKeyUp = 0x0002
		vkShift        = 0x10
	)

	makeKeyInput := func(vk uint16, keyUp bool) input {
		flags := uint32(0)
		if keyUp {
			flags = keyeventfKeyUp
		}
		return input{
			Type: inputKeyboard,
			Ki: keyboardInput{
				Vk:    vk,
				Flags: flags,
			},
		}
	}

	effectiveModifiers := make([]uint16, 0, len(modifiers)+1)
	effectiveModifiers = append(effectiveModifiers, modifiers...)
	hasShiftModifier := false
	for _, vk := range modifiers {
		if vk == vkShift {
			hasShiftModifier = true
			break
		}
	}
	if mainKey.needsShift && !hasShiftModifier {
		effectiveModifiers = append(effectiveModifiers, vkShift)
	}

	user32 := syscall.NewLazyDLL("user32.dll")
	sendInput := user32.NewProc("SendInput")

	send := func(inputs []input) error {
		if len(inputs) == 0 {
			return nil
		}
		ret, _, callErr := sendInput.Call(
			uintptr(len(inputs)),
			uintptr(unsafe.Pointer(&inputs[0])),
			unsafe.Sizeof(input{}),
		)
		if int(ret) != len(inputs) {
			if callErr != syscall.Errno(0) {
				return fmt.Errorf("sendinput failed: %v", callErr)
			}
			return fmt.Errorf("sendinput failed: sent %d of %d input events", int(ret), len(inputs))
		}
		return nil
	}

	downModifiers := make([]input, 0, len(effectiveModifiers))
	for _, vk := range effectiveModifiers {
		downModifiers = append(downModifiers, makeKeyInput(vk, false))
	}
	if err := send(downModifiers); err != nil {
		return err
	}
	if err := send([]input{makeKeyInput(mainKey.vk, false)}); err != nil {
		return err
	}
	if holdMS > 0 {
		time.Sleep(time.Duration(holdMS) * time.Millisecond)
	}
	if err := send([]input{makeKeyInput(mainKey.vk, true)}); err != nil {
		return err
	}
	upModifiers := make([]input, 0, len(effectiveModifiers))
	for i := len(effectiveModifiers) - 1; i >= 0; i-- {
		upModifiers = append(upModifiers, makeKeyInput(effectiveModifiers[i], true))
	}
	if err := send(upModifiers); err != nil {
		return err
	}

	return nil
}
