package sync

import (
	"fmt"
	"image"
	"image/color"
)

func AverageColor(img image.Image) color.Color {
	bounds := img.Bounds()
	var rSum, gSum, bSum, aSum uint64
	var count uint64

	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			r, g, b, a := img.At(x, y).RGBA()
			rSum += uint64(r)
			gSum += uint64(g)
			bSum += uint64(b)
			aSum += uint64(a)
			count++
		}
	}

	// Divide by 256 to convert from 16-bit to 8-bit
	return color.RGBA{
		R: uint8((rSum / count) >> 8),
		G: uint8((gSum / count) >> 8),
		B: uint8((bSum / count) >> 8),
		A: uint8((aSum / count) >> 8),
	}
}

func ColorToHexString(c color.Color) string {
	r, g, b, a := c.RGBA()
	return fmt.Sprintf("#%02x%02x%02x%02x", uint8(r>>8), uint8(g>>8), uint8(b>>8), uint8(a>>8))
}
