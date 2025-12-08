# Stupid test thing

# Makefile for Project API tests

BASE_URL := http://localhost:8080/api/projects

# -------------------
# Create project
# -------------------
test-post:
	curl -X POST $(BASE_URL) \
	    -H "Content-Type: application/json" \
	    -d '{"ownerId":1,"title":"My Test Project","description":"Example description","isPublic":true}'

# -------------------
# Get project by ID
# -------------------
test-get:
	curl -X GET $(BASE_URL)/all

# -------------------
# Update project
# -------------------
test-put:
	curl -X PUT $(BASE_URL) \
	    -H "Content-Type: application/json" \
	    -d '{"id":1,"ownerId":1,"title":"Updated Title","description":"Updated description","isPublic":false}'

# -------------------
# Delete project
# -------------------
test-delete:
	curl -X DELETE $(BASE_URL)/1

#
#curl -X POST http://localhost:3000/api/register \
#  -H "Content-Type: application/json" \
#  -d '{
#     "login": "gay",
#    "email": "test@example.com",
#    "password": "123456",
#    "fullName": "forest_user"
#  }'