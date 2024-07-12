Note: make sure to install firebase globally in your laptop!

IMPORTANT
- 
- Before deploying, add the environment variables to vercel
- rename @firebaseUtils/auth files to an appropriate name for client-side log-in and sign-up
- Double check env file

Not as important
- 
- initial page load is really slow, find out why; might need module import refactoring
- fix the swr announcements loader, should just be a div centering
- [PROBABLY WRONG] I feel like firebaseUtils' 'initAuth' should only be called once
- the log-in and log-out API endpoints accept POST methods, use this for error handling

NOTES
- 
- [IMPORTANT] if formik is stressing you out, do folders! Do not tunnel vision.
- Remember that you can call your firebase-admin object from getFirebaseAdmin
- next-firebase-auth Docs: https://github.com/gladly-team/next-firebase-auth/tree/main#API
- Issue - vercel, storing complex secrets: https://github.com/vercel/vercel/issues/749#issuecomment-707515089
- 

TODO NEXT
- 
- create sign up page, no need to be functional yet
- implement photoURL storageBucket function
- complete sign up API endpoint
- 

TODO
-
- Create app container component [done]
- Rewrite nav layout
- Refactor Nav Bar (desktop)
- Refactor Nav Bar (mobile)


- Clean up bg video component [done]
- Add missing index page without dummy data
- Add missing chat page
- Add missing request page without dummy data
- Add missing account page without dummy data


- Create sign in button
- Create user auth context