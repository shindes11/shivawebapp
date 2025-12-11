# Use the official Node.js 18 image as the base
FROM node:18-alpine AS base
# Set the working directory
WORKDIR /app
# Install dependencies only when needed
FROM node:18 AS deps
WORKDIR /app
# Copy package.json and lock files
COPY package.json package-lock.json ./
# Install dependencies based on the preferred package manager
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi
# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1
# Build the application
RUN yarn build
# If using npm, comment out above and use below instead
# RUN npm run build
# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Copy application files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
# Copy build files
COPY --from=builder /app/.next ./.next
USER nextjs
EXPOSE 3001
ENV PORT 3001
# Set hostname to localhost
ENV HOSTNAME "0.0.0.0"
CMD ["yarn", "start"]
