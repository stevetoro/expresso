# Expresso

A RESTful API containing all of the routing and database logic for an internal management tool for an imaginary coffee shop called Expresso.

## Features

The Expresso internal management tool allows users to:

* Create, view, update, and delete menus
* Create, view, update, and delete menu items
* Create, view, update, and delete employees
* Create, view, update, and delete employees' timesheets

## API Endpoint Documentation

/api/employees

* GET
  * Returns a 200 response containing all saved currently-employed employees (is_current_employee is equal to 1) on the employees property of the response body
* POST
  * Creates a new employee with the information from the employee property of the request body and saves it to the database. Returns a 201 response with the newly-created employee on the employee property of the response body
  * If any required fields are missing, returns a 400 response

/api/employees/:employeeId

* GET
  * Returns a 200 response containing the employee with the supplied employee ID on the employee property of the response body
  * If an employee with the supplied employee ID doesn't exist, returns a 404 response
* PUT
  * Updates the employee with the specified employee ID using the information from the employee property of the request body and saves it to the database. Returns a 200 response with the updated employee on the employee property of the response body
  * If any required fields are missing, returns a 400 response
  * If an employee with the supplied employee ID doesn't exist, returns a 404 response
* DELETE
  * Updates the employee with the specified employee ID to be unemployed (is_current_employee equal to 0). Returns a 200 response
  * If an employee with the supplied employee ID doesn't exist, returns a 404 response

/api/employees/:employeeId/timesheets

* GET
  * Returns a 200 response containing all saved timesheets related to the employee with the supplied employee ID on the timesheets property of the response body
  * If an employee with the supplied employee ID doesn't exist, returns a 404 response
* POST
  * Creates a new timesheet, related to the employee with the supplied employee ID, with the information from the timesheet property of the request body and saves it to the database. Returns a 201 response with the newly-created timesheet on the timesheet property of the response body
  * If an employee with the supplied employee ID doesn't exist, returns a 404 response

/api/employees/:employeeId/timesheets/:timesheetId

* PUT
  * Updates the timesheet with the specified timesheet ID using the information from the timesheet property of the request body and saves it to the database. Returns a 200 response with the updated timesheet on the timesheet property of the response body
  * If any required fields are missing, returns a 400 response
  * If an employee with the supplied employee ID doesn't exist, returns a 404 response
  * If an timesheet with the supplied timesheet ID doesn't exist, returns a 404 response
* DELETE
  * Deletes the timesheet with the supplied timesheet ID from the database. Returns a 204 response
  * If an employee with the supplied employee ID doesn't exist, returns a 404 response
  * If an timesheet with the supplied timesheet ID doesn't exist, returns a 404 response

/api/menus

* GET
  * Returns a 200 response containing all saved menus on the menus property of the response body
* POST
  * Creates a new menu with the information from the menu property of the request body and saves it to the database. Returns a 201 response with the newly-created menu on the menu property of the response body
  * If any required fields are missing, returns a 400 response

/api/menus/:menuId

* GET
  * Returns a 200 response containing the menu with the supplied menu ID on the menu property of the response body
  * If a menu with the supplied menu ID doesn't exist, returns a 404 response
* PUT
  * Updates the menu with the specified menu ID using the information from the menu property of the request body and saves it to the database. Returns a 200 response with the updated menu on the menu property of the response body
  * If any required fields are missing, returns a 400 response
  * If a menu with the supplied menu ID doesn't exist, returns a 404 response
* DELETE
  * Deletes the menu with the supplied menu ID from the database if that menu has no related menu items. Returns a 204 response
  * If the menu with the supplied menu ID has related menu items, returns a 400 response
  * If a menu with the supplied menu ID doesn't exist, returns a 404 response

/api/menus/:menuId/menu-items

* GET
  * Returns a 200 response containing all saved menu items related to the menu with the supplied menu ID on the menuItems property of the response body
  * If a menu with the supplied menu ID doesn't exist, returns a 404 response
* POST
  * Creates a new menu item, related to the menu with the supplied menu ID, with the information from the menuItem property of the request body and saves it to the database. Returns a 201 response with the newly-created menu item on the menuItem property of the response body
  * If any required fields are missing, returns a 400 response
  * If a menu with the supplied menu ID doesn't exist, returns a 404 response

/api/menus/:menuId/menu-items/:menuItemId

* PUT
  * Updates the menu item with the specified menu item ID using the information from the menuItem property of the request body and saves it to the database. Returns a 200 response with the updated menu item on the menuItem property of the response body
  * If any required fields are missing, returns a 400 response
  * If a menu with the supplied menu ID doesn't exist, returns a 404 response
  * If a menu item with the supplied menu item ID doesn't exist, returns a 404 response
* DELETE
  * Deletes the menu item with the supplied menu item ID from the database. Returns a 204 response
  * If a menu with the supplied menu ID doesn't exist, returns a 404 response
  * If a menu item with the supplied menu item ID doesn't exist, returns a 404 response