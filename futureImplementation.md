### Future ideas/challenges that could be implemented to our project

#### API
* Implement restriction that users can only review a tour **that they have actually booked**.
* Implement nested booking routes: ```/tours/:id/bookings``` and ```/users/:id/bookings```.
* **Improve tour dates**: add a ```participants``` and a ```soldOut``` field to each date. A date then becomes like an instance of the tour. Then, when a user books, they ned to select one of the dates. A new booking will increase the number of participants in the date, until it is booked out (```participants > maxGroupSize```). So, when a user wants to book, you nee to check if tour on the selected date is still available.
* Implement **advanced authentication features**: confirm user email, keep users logged in with refresh tokens, two-factor authentication, etc.

#### WEBSITE
* Implement a sign up from, similar to the login form
* On the tour detail page, ifd a user has taken a tour, allow them **add a review directly on the website**. Implement a form for this.
* **Hide the entire booking section** on the tour detail page if current user has already booked the tour (also prevent duplicate bookings on the model).
* **Implement "like tour" functionality**, with favorite tour page.
* On the user account page, implement the **"My Review"** page, where all reviews are displayed, and a user can edit them. (*suggested framework: React*⚛️)
* For administrators, implement all the "**Manage**" pages, where they can CRUD (create, read, update, delete) tours, users, reviews and bookings.
