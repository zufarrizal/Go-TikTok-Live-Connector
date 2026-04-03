package main

import (
	"bytes"
	"encoding/binary"
	"image"
	"image/color"
	"image/png"
	"os"
	"path/filepath"
)

func main() {
	const size = 256
	img := image.NewNRGBA(image.Rect(0, 0, size, size))

	bgTop := color.NRGBA{R: 24, G: 24, B: 30, A: 255}
	bgBottom := color.NRGBA{R: 10, G: 10, B: 14, A: 255}
	for y := 0; y < size; y++ {
		t := float64(y) / float64(size-1)
		r := uint8(float64(bgTop.R)*(1-t) + float64(bgBottom.R)*t)
		g := uint8(float64(bgTop.G)*(1-t) + float64(bgBottom.G)*t)
		b := uint8(float64(bgTop.B)*(1-t) + float64(bgBottom.B)*t)
		for x := 0; x < size; x++ {
			img.SetNRGBA(x, y, color.NRGBA{R: r, G: g, B: b, A: 255})
		}
	}

	// Rounded square accent blocks (cyan + red) to evoke TikTok-style contrast.
	drawRoundedRect(img, image.Rect(54, 38, 178, 162), color.NRGBA{R: 0, G: 245, B: 255, A: 255}, 30)
	drawRoundedRect(img, image.Rect(78, 68, 202, 192), color.NRGBA{R: 255, G: 55, B: 95, A: 240}, 30)

	// Monogram "G" in white.
	drawRoundedRect(img, image.Rect(82, 74, 188, 180), color.NRGBA{R: 255, G: 255, B: 255, A: 255}, 24)
	drawRoundedRect(img, image.Rect(106, 98, 206, 204), color.NRGBA{R: 10, G: 10, B: 14, A: 255}, 20)
	drawRoundedRect(img, image.Rect(138, 122, 206, 148), color.NRGBA{R: 255, G: 255, B: 255, A: 255}, 10)

	if err := os.MkdirAll("assets", 0755); err != nil {
		panic(err)
	}

	pngPath := filepath.Join("assets", "app-icon.png")
	icoPath := filepath.Join("assets", "app-icon.ico")

	pngData, err := encodePNG(img)
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile(pngPath, pngData, 0644); err != nil {
		panic(err)
	}

	icoData, err := wrapPNGAsICO(pngData, size, size)
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile(icoPath, icoData, 0644); err != nil {
		panic(err)
	}
}

func encodePNG(img image.Image) ([]byte, error) {
	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func wrapPNGAsICO(pngData []byte, width int, height int) ([]byte, error) {
	const (
		iconDirSize    = 6
		iconEntrySize  = 16
		iconImageStart = iconDirSize + iconEntrySize
	)
	out := bytes.NewBuffer(make([]byte, 0, iconImageStart+len(pngData)))

	// ICONDIR
	_ = binary.Write(out, binary.LittleEndian, uint16(0)) // reserved
	_ = binary.Write(out, binary.LittleEndian, uint16(1)) // type icon
	_ = binary.Write(out, binary.LittleEndian, uint16(1)) // count

	w := uint8(width)
	h := uint8(height)
	if width >= 256 {
		w = 0
	}
	if height >= 256 {
		h = 0
	}

	// ICONDIRENTRY
	_ = out.WriteByte(w)
	_ = out.WriteByte(h)
	_ = out.WriteByte(0) // palette colors
	_ = out.WriteByte(0) // reserved
	_ = binary.Write(out, binary.LittleEndian, uint16(1))
	_ = binary.Write(out, binary.LittleEndian, uint16(32))
	_ = binary.Write(out, binary.LittleEndian, uint32(len(pngData)))
	_ = binary.Write(out, binary.LittleEndian, uint32(iconImageStart))

	_, _ = out.Write(pngData)
	return out.Bytes(), nil
}

func drawRoundedRect(img *image.NRGBA, r image.Rectangle, c color.NRGBA, radius int) {
	for y := r.Min.Y; y < r.Max.Y; y++ {
		for x := r.Min.X; x < r.Max.X; x++ {
			if insideRoundedRect(x, y, r, radius) {
				img.SetNRGBA(x, y, c)
			}
		}
	}
}

func insideRoundedRect(x, y int, r image.Rectangle, radius int) bool {
	if radius <= 0 {
		return true
	}
	left := r.Min.X
	right := r.Max.X - 1
	top := r.Min.Y
	bottom := r.Max.Y - 1

	if x >= left+radius && x <= right-radius {
		return true
	}
	if y >= top+radius && y <= bottom-radius {
		return true
	}

	// Check corner circles.
	corners := [4][2]int{
		{left + radius, top + radius},
		{right - radius, top + radius},
		{left + radius, bottom - radius},
		{right - radius, bottom - radius},
	}
	rr := radius * radius
	for _, p := range corners {
		dx := x - p[0]
		dy := y - p[1]
		if dx*dx+dy*dy <= rr {
			return true
		}
	}
	return false
}
