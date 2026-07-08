package main

import (
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"strings"
)

// Integrity verification data.
// Fragments are XOR-encrypted watermark payloads.
// Scatter hashes are distributed integrity markers.

const (
	_wmK  = 0x4D       // MASJUP cipher key
	_wmS0 = "NzgrLD8/" // fragment 0
	_wmS1 = "JDcsIXd7" // fragment 1
	_wmS2 = "f3V4fHh7" // fragment 2
	_wmS3 = "eHt9fXh4" // fragment 3
	_wmH  = "5926e983b844156c33d4df268693a70aae93fbca390ab21d78802aed17a757f0"
)

// Scatter hash integrity markers.
// Changing ANY value causes verification failure.
const (
	_wmSH0 uint32 = 3034379986
	_wmSH1 uint32 = 3752798343
	_wmSH2 uint32 = 2566984322
	_wmSH3 uint32 = 3707237058
	_wmSH4 uint32 = 1745356434
	_wmSH5 uint32 = 1889085164
	_wmSH6 uint32 = 4187412489
	_wmSH7 uint32 = 1083323354
)

var _wmScatter = [8]uint32{
	_wmSH0, _wmSH1, _wmSH2, _wmSH3,
	_wmSH4, _wmSH5, _wmSH6, _wmSH7,
}

// WMVerify checks watermark integrity. Returns true if valid.
// Called from main() — removing this file causes build failure.
func WMVerify() bool {
	encoded := _wmS0 + _wmS1 + _wmS2 + _wmS3

	encrypted, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return false
	}

	decrypted := make([]byte, len(encrypted))
	for i, b := range encrypted {
		decrypted[i] = b ^ byte(_wmK)
	}
	payload := string(decrypted)

	parts := strings.SplitN(payload, ":", 2)
	if len(parts) != 2 {
		return false
	}

	hash := sha256.Sum256([]byte(payload))
	hashHex := hex.EncodeToString(hash[:])
	if hashHex != _wmH {
		return false
	}

	expected := _wmComputeScatter(payload)
	for i, v := range _wmScatter {
		if v != expected[i] {
			return false
		}
	}

	return true
}

func _wmComputeScatter(payload string) [8]uint32 {
	var result [8]uint32
	for i := 0; i < 8; i++ {
		h := sha256.Sum256([]byte(payload + ":" + string(rune('0'+i))))
		result[i] = uint32(h[0])<<24 | uint32(h[1])<<16 | uint32(h[2])<<8 | uint32(h[3])
	}
	return result
}
