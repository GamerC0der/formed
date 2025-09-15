# Formed

Forms, done right. The App is built in NextJS, and uses ShadCN + Tailwind. The app begins with a landing page hero section with a create form button and a try demo (goes to a demo form).

The create form menu enables users to drag and drop and create forms quickly. You can simply publish your form at the top right, with one click. Forms can be viewed at the bottom.

Forms Include:
- Text Inputs
- Number
- Textarea
- Select
- Checkbox
- Radio
- Slider
- Iframe
- Ratings
& so much more!

You can edit properties (such as being required) at the right properties panel. You can also previe your form to the left of the Publish button. 

To start your form, you can either start manually, or use AI via the Start with AI button which uses Kimi K2 to generate a form (JSON) based on your input prompt. It takes about 15s and generates great starting forms.

# Setup

Install: `sudo npm i`
Run: `sudo npm run dev` or `sudo vc dev`
Deploy: `sudo vc deploy`

Set a database url via DATABASE_URL in .env.local (MYSQL), and an admin password (example ADMIN_PASSWORD=your_password_goes_here)

# Hosted Demo

Try the hosted demo at https://formed-three.vercel.app/. 