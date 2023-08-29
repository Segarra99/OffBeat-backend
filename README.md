# Off Beat

<br>

## Description

Off Beat: A revolutionary music web app fostering creative synergy. Empowering musicians, bands, and labels to seamlessly connect, showcase their art, and forge collaborations. Join the harmonious network that reshapes the music industry's digital landscape.

## User Stories

-  **404:** As a user I get to see a 404 page with a feedback message if I try to reach a page that does not exist so that I know it's my fault.
-  **Signup:** As an anonymous user I can sign up on the platform.
-  **Login:** As a user I can login to the platform so that I can access my profile and use the webapp functionality.
-  **Logout:** As a logged in user I can logout from the platform so no one else can use it.
-  **Profile Page (artists page):** As a logged in user I can visit my profile page so that I can access the edit page and see the list of instruments I play, bands I have played with, bands I'm a member of, and connections.
-  **Edit Profile Page:** As a user I want to be able to edit my profile sections.
-  **Add Band:** As a logged in user I can access the add band page so that I can create a new band.
-  **Edit Band:** As a logged in user I can access the edit band page so that I can edit the band I created.
-  **Band Review:** As a logged in user I can access the band page and I can leave a review.
-  **View Bands Table:** As a user I want to see the band details and artists.
-  **View Ranks:** As a user I can see the rankings list for the artists and bands.




## Backlog

- spotify API
- user connections
- users can leave reviews
- dark mode
- music samples
- labels


<br>


# Client / Frontend

## React Router Routes (React App)

| Path                         | Component            | Permissions                | Behavior                                                  |
| ---------------------------- | -------------------- | -------------------------- | --------------------------------------------------------- |
| `/login`                     | LoginPage            | anon only `<AnonRoute>`    | Login form, navigates to home page after login.           |
| `/signup`                    | SignupPage           | anon only  `<AnonRoute>`   | Signup form, navigates to home page after signup.         |
| `/`                          | HomePage             | public `<Route>`           | Home page.                                                |
| `/user-profile`              | ProfilePage          | user only `<PrivateRoute>` | User and artist profile for the current user.             |
| `/user-profile/edit`         | EditProfilePage      | user only `<PrivateRoute>` | Edit user profile form.                                   |
| `/bands/create`           | CreateBandPage | user only `<PrivateRoute>` | Create new band form.                               |
| `/bands`               | BandListPage   | user only `<PrivateRoute>` | Bands list.                                         |
| `/bands/:bandId` | BandDetailPage | user only `<PrivateRoute>` | Band details. Shows artists list and other details. |
| `/band/artists/:id`    | artistDetailsPage    | user only `<PrivateRoute>` | Single artist details.                                    |
| `/rankings`    | RankingsPage         | user only `<PrivateRoute>` | Band and artist rankings list.                                 |





## Components

Pages:

- LoginPage

- SignupPage

- HomePage

- ProfilePage

- EditProfilePage

- CreateBandPage

- BandListPage

- ArtistListPage

- BandDetailsPage

- RankingsPage


  

Components:

- ArtistCard
  
- BandCard
  
- Navbar





## Services

- **Auth Service**

  - `authService` :
    - `.login(user)`
    - `.signup(user)`
    - `.logout()`
    - `.validate()`

- **User Service**

  - `userService` :
    - `.updateCurrentUser(id, userData)`
    - `.getCurrentUser()`

- **Band Service**

  - `bandService` :
    - `.addBand(bandData)`
    - `.getBands()`
    - `.getOneBand(id)`
    - `.deleteBand(id)`

  



<br>


# Server / Backend


## Models

**User model**

```javascript
{
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nationality: { type: String},
  description: { type: String },
  genres: [String],
  instruments: [String],
  rank: {type: Number},
  img: { type: String },
  bands: { type: Schema.Types.ObjectId, ref:'Band' },
  bandReviews: { type: Schema.Types.ObjectId, ref:'Review' },
  artistReviews: { type: Schema.Types.ObjectId, ref:'Review' },
  samples: [ String ]
}
```



**Band model**

```javascript
 {
  name: { type: String, required: true, unique: true},
  img: { type: String },
  description: { type: String },
  genres: [String],
  founder: { type: Schema.Types.ObjectId, ref:'User', required: true },
  artists: [ { type: Schema.Types.ObjectId, ref:'User'} ],
  samples: [ String ],
  rank: {Number},
  reviews: [{}],
  missing: [ String ],
  label: { type: String }
 }
```


**Review model**

```javascript
{
  content: { type: String, required: true },
  img: { type: String },
  user: { type: Schema.Types.ObjectId, ref:'User'},
  band: { type: Schema.Types.ObjectId, ref:'Band'},
  artist: { type: Schema.Types.ObjectId, ref:'User'}
}
```





<br>


## API Endpoints (backend routes)

| HTTP Method | URL                    | Request Body                 | Success status | Error Status | Description                                                  |
| ----------- | ---------------------- | ---------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| GET         | `/auth/profile    `    | Saved session                | 200            | 404          | Check if user is logged in and return profile page           |
| POST        | `/auth/signup`         | {firstName, lastName, username, email, password, img, nationality}      | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`          | {username, password}         | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| POST        | `/auth/logout`         |                              | 204            | 400          | Logs out the user                                            |
| GET         | `/api/bands`     |                              |                | 400          | Show all bands                                         |
| GET         | `/api/bands/:id` |                              |                |              | Show specific band                                     |
| POST        | `/api/bands`     | { name, img, description, artists, genres, founder, missing }       | 201            | 400          | Create and save a new band                             |
| PUT         | `/api/bands/:id` | { name, img, description, artists, genres, missing }       | 200            | 400          | edit band                                              |
| DELETE      | `/api/bands/:id` |                              | 201            | 400          | delete band                                         
| GET         | `/api/artists`     |                              |                | 400          | Show all artists                                         |
| GET         | `/api/artists/:id`     |                              |                |              | show specific artist                          
| PUT         | `/api/artists/:id`     | { genres, description, img, instruments, bands, nationality }                | 201            | 400          | edit user profile                                         
| DELETE      | `/api/artists/:id`     |                              | 200            | 400          | delete artist                                                |
| GET         | `/api/games`           |                              | 201            | 400          | show games                                                                                            


<br>


## Links

### Trello/Kanban

[See trello board](https://trello.com/b/gOe4iANB/off-beat).

### Git

[Client repository Link](https://github.com/Segarra99/OffBeat-frontend)

[Server repository Link](https://github.com/pinto-andre/OffBeat-backend)
