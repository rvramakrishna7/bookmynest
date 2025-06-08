

### 🏠 *BookMyNest – Full-Stack Property Listing Platform*

*BookMyNest* is a full-featured, scalable web application built using the **MERN stack** (MongoDB, Express.js, Node.js) with **EJS templating**. It allows users to create, browse, and review rental property listings with a secure login system, geolocation, and dynamic image handling.



### 🔐 *Authentication & Authorization*

* *Session-based Auth Flow:* Implemented using **Passport.js** for secure login and registration.
* *Flash Messaging & Error Handling:* Users receive real-time feedback through **connect-flash** and custom Express error handlers.
* *Route Protection:* Middleware ensures only authenticated users can access sensitive routes like creating or editing listings.


### 🗺️ *Features & Functionality*

* *Listing Management:* Authenticated users can create, edit, or delete listings with image uploads via **Multer** and **Cloudinary**.
* *Review System:* Nested reviews per listing with author-based deletion protection.
* *Geocoding with Mapbox:* Listings include interactive map locations using **Mapbox Geocoding API**.
* *MVC Structure:* Follows Model-View-Controller architecture for modular and maintainable code.



### ☁ *Deployment & Infrastructure*

* *Render Hosting:* Full app deployed on **Render** with public access to all features.
* *Cloud Database:* Integrated with **MongoDB Atlas** for secure and scalable production storage.
* *Environment Configuration:* Secrets and API keys managed via `.env` and the Render dashboard.



### 🛠 *Tech Stack*

* *Backend:* Node.js, Express.js, MongoDB Atlas, Passport.js, connect-mongo, Joi, Cloudinary, Multer
* *Frontend:* EJS, Bootstrap 5, Mapbox API, custom CSS
* *Tools & DevOps:* Git, GitHub, Render, dotenv, method-override, connect-flash




