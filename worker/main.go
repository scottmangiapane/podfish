package main

import (
	"fmt"

	"github.com/scottmangiapane/podfish/shared"
)

func main() {
	fmt.Println("Starting worker...")
	shared.InitDatabase()
}
