# Employee Attendance System Backend

### Employee Check In
Endpoint: POST /api/attendance/checkin
Purpose:
- Allows an employee to check in for the day. Ensures no duplicate check-ins are made for the same date.
Request Payload (CheckInDTO):
- employee_name (string) – Name of the employee
- employee_id (string) – Unique identifier for the employee
- department (string) – Department the employee belongs to
Key Logic:
- Validation: Checks for presence of all required fields
- Duplicate Check:
- Executes a query to see if the employee has already checked in today
- If yes → returns 409 Conflict: Already checked in today
- Inserts a new row in the attendance table with current timestamp as check_in_time

### Employee Check Out
Endpoint: POST /api/attendance/checkout
Purpose:
- Allows an employee to check out, marking the end of their workday.
Request Payload (CheckOutDTO):
- employee_id (string) – Unique identifier of the employee
Key Logic:
- Validation: Checks if employee_id is provided
Eligibility Check:
- Verifies that the employee has already checked in today
- Ensures that they haven't already checked out (check_out_time IS NULL)
- If not eligible → returns 409 Conflict: Employee has not checked in today
Check-Out: Updates the check_out_time to the current timestamp for the relevant record

### Get All Attendance Records
Endpoint: GET /api/attendance
Purpose:
- Fetches the complete list of all employee attendance records in the system.
Request Parameters:
- None – This API does not require query parameters or a body.
Key Logic:
- Executes a SELECT query to fetch all rows from the attendance table
- Sorts records by check_in_time in descending order (latest first)
- Returns a JSON array of attendance objects
Response:
- 200 OK with the list of records
- 500 Internal Server Error if there's an issue with database access

### Get Attendance By Employee ID
Endpoint: GET /api/attendance/:employeeID
Purpose:
- Retrieves all attendance records for a specific employee based on their ID.
Path Parameter:
- employeeId (string) – The unique ID of the employee whose records are being requested
Key Logic:
- Executes a SELECT query filtering by employee_id
- Orders results by check_in_time in descending order
- Returns all check-in and check-out data associated with that employee
Response:
- 200 OK with the list of that employee’s attendance entries
- 500 Internal Server Error if a database issue occurs

### Get Reports Using Queries
Endpoint: GET /api/attendance/reports/all
Purpose:
- Generates a custom attendance report based on optional filters like name, department, and date range.
Query Parameters (Optional):
- name (string) – Partial or full employee name (supports wildcard search)
- department (string) – Exact department name
- from (date) – Start date for attendance range
- to (date) – End date for attendance range
Key Logic:
- Dynamically builds the SQL query based on which filters are provided and executes it
