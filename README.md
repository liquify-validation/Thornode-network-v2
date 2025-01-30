# Thornode Dashboard V2

This project is a React dashboard (bundled via Vite) that monitors THORNode information. It collates data such as active, standby, or “other” (historical/retiring) nodes, network stats, and provider/bond details. The dashboard fetches data from an external (separate) backend API.

## Features

- Active / Standby / Other Tabs: Quickly switch between node categories.
- Search & Filters: Filter nodes by address or other criteria.
- Sorting & Pagination: Sort node data, including providers, slash points, rewards, APY, etc.
- Charts & Graphs: Visualize trends (bond over time, slashes, position, etc.).
- Responsive UI: Built with React & Tailwind (or CSS) for a responsive user interface.
- External API Integration: Fetches data from a separate Python-based backend (not included in this repo).

## Installation

Clone the Repo:

```bash
  git clone https://github.com/liquify-validation/Thornode-network-v2.git 
  cd Thornode-network-v2
```

Install Dependencies:

```bash
  npm install

```

Configure Environment:

Create .env file in root

```bash
  VITE_API_URL=https://apiv2.liquify.com/thor/api
```

Run Development Server:

```bash
  npm run dev

```

## Deployment

To deploy this project run

Build Production Bundle:

```bash
  npm run build

```

This outputs a dist/ folder containing the optimized production build.

### Deploy

Copy the dist/ folder to your preferred hosting (Netlify, Vercel, S3 bucket, etc.).

Ensure your environment variables and API base URLs are set correctly.

## Contributing

Contributions are always welcome!

Fork the repo and create a new branch for your feature or bug fix.

Commit changes with clear messages.

Open a Pull Request describing your changes.

Please follow any coding style or lint guidelines and ensure your code builds successfully before submitting.

## Additional Notes

You can find the python backend at the link below

[Python Backend](https://github.com/liquify-validation/thordash-backend)
