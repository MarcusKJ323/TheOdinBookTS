# The Odin Book

The "The Odin Book" is a Projekt form the [Theodinproject](https://www.theodinproject.com/). It is a basic version of the social media giant [Facebook](https://www.facebook.com/).

# Cloning the Project

### This instruction is for VSCode

The following will show you how to set up the project on you PC

1. Clone the repository

   ```
       git clone https://github.com/Buschhen/TheOdinBook.git
   ```

   Your local clone will be created

2. Download the dependencies

   ```
   npm i
   ```

3. Create a Mongodb database
   There for click on the [link](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose) and follow the tutorial

4. Create a .env file
   cd into your root folder

   `touch .env`

   In that file you write

   ```
   DB_ADR="YOUR DATABASE CONNECTION"
   ```

5. Now are able to start the website
   agin cd in the root folder

   ```
   debug=theodinbook:* npm run devstart
   ```

   Then click on this [link](http://localhost:3000/catalog)

# How to use the site

1. Set up a User
   ![signup](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/signup.png)

2. Fill out the form
   ![signup_2](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/signup_2.png)
   Press enter or click on signup
3. login
   ![login](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/login.png)
   Press enter or click Submit
4. Your site should look like this
   ![home](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/home.png)

# How to add messages

1. Click on Your Profile
   ![profile](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/profile.png)
2. Click on New MSG
   ![MSG](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/MSG.png)
3. Fill out the form
   ![MSG_2](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/MSG_2.png)
   Press enter or Click Submit
4. You will see the Message on your Profile
   ![profile_2](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/profile_2.png)
5. Your message is now displayed on the mainpage
   Click on home
   ![home_2](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/home_2.png)
   Your home now should looke this
   ![home_3](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/home_3.png)

# How to like and comment on messages

## Like

1. On the homepage
   ![like](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/like.png)
   Now it looks like this
   ![like_2](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/like_2.png)

## comment

1. Fill out the commentline
   ![comment](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/comment.png)
2. Press enter or click Submit
   ![comment_2](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/comment_2.png)
3. Now it should like this
   ![comment_3](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/comment_3.png)

# How to add friends

## Create friendrequest

1. Create a new [user](https://raw.githubusercontent.com/Buschhen/TheOdinBook#how-to-use-the-site)
2. It now should look like this
   ![friend](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/friend.png)
3. Click on Add Friend
   ![friend_2](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/friend_2.png)
   It should look like this now
   ![friend_3](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/friend_3.png)

## Accept friendrequest

1. Login to the account you send the friendrequest to
2. You now should see that you got a friendrequest
   ![friend_4](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/friend_4.png)
3. Now you only need to accept the friendrequest
   ![friend_5](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/friend_5.png)
   After you accepted the friendrequest it should look like this
   ![friend_6](https://raw.githubusercontent.com/Buschhen/TheOdinBook/master/photo/friend_6.png)
