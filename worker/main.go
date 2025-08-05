package main

import (
	"log"

	"github.com/scottmangiapane/podfish/shared"
)

func main() {
	log.Println("Starting worker...")
	shared.SetupDatabase()
}
