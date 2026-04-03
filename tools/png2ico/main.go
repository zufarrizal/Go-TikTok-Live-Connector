package main

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"image/png"
	"os"
)

func main() {
	if len(os.Args) != 3 {
		fmt.Fprintln(os.Stderr, "usage: go run ./tools/png2ico <input.png> <output.ico>")
		os.Exit(1)
	}
	inPath := os.Args[1]
	outPath := os.Args[2]

	pngData, err := os.ReadFile(inPath)
	if err != nil {
		fmt.Fprintln(os.Stderr, "read input:", err)
		os.Exit(1)
	}
	cfg, err := png.DecodeConfig(bytes.NewReader(pngData))
	if err != nil {
		fmt.Fprintln(os.Stderr, "decode png:", err)
		os.Exit(1)
	}

	icoData, err := wrapPNGAsICO(pngData, cfg.Width, cfg.Height)
	if err != nil {
		fmt.Fprintln(os.Stderr, "build ico:", err)
		os.Exit(1)
	}
	if err := os.WriteFile(outPath, icoData, 0644); err != nil {
		fmt.Fprintln(os.Stderr, "write output:", err)
		os.Exit(1)
	}
}

func wrapPNGAsICO(pngData []byte, width int, height int) ([]byte, error) {
	const (
		iconDirSize    = 6
		iconEntrySize  = 16
		iconImageStart = iconDirSize + iconEntrySize
	)
	out := bytes.NewBuffer(make([]byte, 0, iconImageStart+len(pngData)))

	if err := binary.Write(out, binary.LittleEndian, uint16(0)); err != nil {
		return nil, err
	}
	if err := binary.Write(out, binary.LittleEndian, uint16(1)); err != nil {
		return nil, err
	}
	if err := binary.Write(out, binary.LittleEndian, uint16(1)); err != nil {
		return nil, err
	}

	w := uint8(width)
	h := uint8(height)
	if width >= 256 {
		w = 0
	}
	if height >= 256 {
		h = 0
	}

	if err := out.WriteByte(w); err != nil {
		return nil, err
	}
	if err := out.WriteByte(h); err != nil {
		return nil, err
	}
	if err := out.WriteByte(0); err != nil {
		return nil, err
	}
	if err := out.WriteByte(0); err != nil {
		return nil, err
	}
	if err := binary.Write(out, binary.LittleEndian, uint16(1)); err != nil {
		return nil, err
	}
	if err := binary.Write(out, binary.LittleEndian, uint16(32)); err != nil {
		return nil, err
	}
	if err := binary.Write(out, binary.LittleEndian, uint32(len(pngData))); err != nil {
		return nil, err
	}
	if err := binary.Write(out, binary.LittleEndian, uint32(iconImageStart)); err != nil {
		return nil, err
	}
	if _, err := out.Write(pngData); err != nil {
		return nil, err
	}
	return out.Bytes(), nil
}

