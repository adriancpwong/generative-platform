Testing:

docker-compose up --build

curl -X POST "http://localhost:5000/search" \
 -H "Content-Type: application/json" \
 -d '{"query": "test"}'
