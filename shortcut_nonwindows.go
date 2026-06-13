//go:build !windows

package main

import "fmt"

func executeKeyboardShortcut(shortcut string, holdMS int) error {
	_ = shortcut
	_ = holdMS
	return fmt.Errorf("keyboard shortcut is only supported on Windows")
}

func ensureAdminPrivileges() error {
	return nil
}
