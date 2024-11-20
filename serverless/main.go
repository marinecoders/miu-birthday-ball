package main

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"strings"
)

type Event struct {
	Key string `json:"key"`
}

type Attendee struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Table     string `json:"table"`
	Title     string `json:"title"`
}

type ResponseHeaders struct {
	ContentType  string `json:"Content-Type"`
	CacheControl string `json:"Cache-Control"`
}

type Response struct {
	Body       string          `json:"body"`
	StatusCode string          `json:"statusCode"`
	Headers    ResponseHeaders `json:"headers"`
}

func Main(ctx context.Context, event Event) Response {
	// first_name, last_name, table

	fmt.Println(event)

	if event.Key != os.Getenv("PASS") {
		return Response{
			Body:       "Unauthorized",
			StatusCode: "400",
			Headers: ResponseHeaders{
				ContentType: "text/html",
			},
		}
	}

	attendees := []Attendee{}

	csvData := os.Getenv("DATA")
	reader := csv.NewReader(strings.NewReader(csvData))

	_, err := reader.Read()
	if err != nil {
		log.Fatal(err)
	}

	lastTableNumber := 0

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		// Get the table number
		tableNumberStr := record[0]

		// If the table number is empty, use the last seen table number
		var tableNumber int
		if tableNumberStr == "" {
			tableNumber = lastTableNumber
		} else {
			tableNumber, err = strconv.Atoi(tableNumberStr)
			if err != nil {
				log.Fatal(err)
			}
			lastTableNumber = tableNumber
		}
		tableStr := strconv.Itoa(tableNumber)
		a := Attendee{FirstName: record[1], LastName: record[2], Table: tableStr, Title: record[3]}

		a.Title = strings.TrimSpace(a.Title)

		attendees = append(attendees, a)
	}

	jsonData, err := json.Marshal(attendees)
	if err != nil {
		fmt.Println("Error:", err)
	}

	/* fakeData := []Attendee{}
	fakeData = append(fakeData, Attendee{FirstName: "John", LastName: "Cena", Table: "🐝", Title: "Sir"})
	fakeJsonData, err := json.Marshal(fakeData)
	if err != nil {
		fmt.Println("Error:", err)
	} */

	fmt.Println(jsonData)
	fmt.Println(fakeJsonData)
	return Response{
		Body: string(jsonData),
		// Body: string(fakeJsonData),
		StatusCode: "200",
		Headers: ResponseHeaders{
			ContentType:  "application/json",
			CacheControl: "max-age=604800",
		},
	}
}
