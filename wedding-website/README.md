# Wedding Website

A beautiful, minimalist wedding website built with Next.js, Tailwind CSS, and Supabase.

**Features:**
- 🏠 Elegant homepage with countdown timer
- 💒 Venue & schedule details
- 🏨 Accommodation recommendations
- 💌 Personalized RSVP system (guests log in with unique code)
- 🍽️ Meal selection and dietary requirements
- 🎵 Song requests
- 📖 Recipe collection from guests
- 🎁 Registry page with UK registry recommendations
- 📧 Contact form with email notifications
- 👨‍💼 Admin dashboard for managing guests, RSVPs, and messages

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel (recommended)
- **Animations:** Framer Motion

## Quick Start

### 1. Clone and Install

```bash
cd wedding-website
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the contents of `database/schema.sql`
4. Go to **Settings > API** and copy your credentials

### 3. Configure Environment

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
```

### 4. Customize Your Wedding Details

Edit `src/lib/constants.ts` to update:

- Partner names and wedding date
- Venue details and addresses
- Schedule/timeline
- Meal options (when confirmed)
- Accommodation list
- Registry links
- Contact email

### 5. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

1. Push your code to GitHub
2. Import your repo at [vercel.com](https://vercel.com)
3. Add your environment variables in Vercel project settings
4. Deploy!

## Project Structure

```
wedding-website/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Homepage
│   │   ├── our-story/         # Your story page
│   │   ├── venue/             # Venue & schedule
│   │   ├── accommodation/     # Hotels & travel
│   │   ├── rsvp/              # Guest RSVP
│   │   ├── registry/          # Gift registry
│   │   ├── contact/           # Contact form
│   │   ├── admin/             # Admin dashboard
│   │   └── api/               # API routes
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities & config
│   └── types/                 # TypeScript types
├── database/
│   └── schema.sql             # Supabase database schema
├── public/                    # Static assets
└── tailwind.config.ts         # Tailwind configuration
```

## Admin Panel

Access the admin panel at `/admin`

Default password: `wedding2026` (change this in `.env.local`)

**Admin Features:**
- Dashboard with RSVP statistics
- Guest list management (add/edit/delete guests)
- View all RSVP responses
- Export guest data to CSV
- View submitted recipes
- Read contact form messages

## Adding Guests

1. Go to `/admin/guests`
2. Click "Add Guest"
3. Fill in details (unique codes are auto-generated)
4. Share the code with your guest via your invitations

Each guest gets a unique code like `ABC123` which they enter on the RSVP page to see their personalized form.

## Customization

### Colors

The burgundy color scheme is defined in `tailwind.config.ts`. Modify the `burgundy` and `cream` color palettes to match your wedding colors.

### Fonts

The site uses:
- **Playfair Display** for headings
- **Lato** for body text

Change these in `src/app/globals.css` by updating the Google Fonts import.

### Content

Most text content is in the individual page files under `src/app/`. The homepage, our story, and accommodation pages have placeholder text that you should replace with your own content.

## Email Notifications

For contact form email notifications, you have several options:

1. **Resend** (recommended): Easy setup, generous free tier
2. **SendGrid**: Industry standard, free tier available
3. **Custom webhook**: Use services like Zapier or Make

Set the `EMAIL_WEBHOOK_URL` in your environment variables.

## Troubleshooting

### Database connection issues
- Verify your Supabase URL and keys are correct
- Check that RLS policies are set up correctly
- Ensure the schema has been run

### RSVP not working
- Make sure guests exist in the database
- Verify the guest code matches exactly (case-sensitive)

### Admin panel locked out
- Check the `NEXT_PUBLIC_ADMIN_PASSWORD` environment variable
- Clear browser session storage

## License

This project is for personal use for your wedding. Feel free to customize it however you like!

---

Made with ❤️ for Harry Burnham's wedding
