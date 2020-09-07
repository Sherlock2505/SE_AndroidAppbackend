# SE_AndroidAppbackend

# Description

This is the REST-API created for serving the ReuseNation App. This uses npm modules to run the server.

# Requirements

The node modules inside the package.json are to be installed to be able to run project.
For the installation of node use:-

    $ sudo apt install nodejs
    $ sudo apt install npm


# Installation

## development server

      $ git clone https://github.com/Sherlock2505/SE_AndroidAppbackend
      $ cd SE_course_proj_backend
      $ npm install --save
      $ npm start

use localhost:3000 as the base-url to make requests.

## production server

use [BASE_URL](https://se-course-app.herokuapp.com) as base-url to make requests

# Usage

The following are the major requests that can be made to server
* Sign In - {BASE_URL}/users/create
* Login - {BASE_URL}/users/login
* Sell product - {BASE_URL}/{type_of_waste}/create
* Delete sold out product - {BASE_URL}/{type_of_waste}/delete/:id
* Add product to wishlist - {BASE_URL}/users/add/wishlist
* Get the location filtered results - {BASE_URL}/{type_of_waste}/all/:pin

type_of_waste = {"ewaste", "textwaste", "notewaste"}

# Credits

  [DEEP MAHESHWARI](https://github.com/Sherlock2505)      
  [NIKHIL M](https://github.com/officialynik)
