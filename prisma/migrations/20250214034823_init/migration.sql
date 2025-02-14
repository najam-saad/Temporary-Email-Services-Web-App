-- CreateTable
CREATE TABLE "TempEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TempEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "html" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailId" TEXT NOT NULL,
    "headers" JSONB,
    "isSpam" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedDomain" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockedDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpamSignature" (
    "id" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpamSignature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempEmail_email_key" ON "TempEmail"("email");

-- CreateIndex
CREATE INDEX "TempEmail_email_idx" ON "TempEmail"("email");

-- CreateIndex
CREATE INDEX "TempEmail_expiresAt_idx" ON "TempEmail"("expiresAt");

-- CreateIndex
CREATE INDEX "Message_emailId_idx" ON "Message"("emailId");

-- CreateIndex
CREATE INDEX "Message_receivedAt_idx" ON "Message"("receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RateLimit_key_key" ON "RateLimit"("key");

-- CreateIndex
CREATE INDEX "RateLimit_key_idx" ON "RateLimit"("key");

-- CreateIndex
CREATE INDEX "RateLimit_resetAt_idx" ON "RateLimit"("resetAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedDomain_domain_key" ON "BlockedDomain"("domain");

-- CreateIndex
CREATE INDEX "BlockedDomain_domain_idx" ON "BlockedDomain"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "SpamSignature_pattern_key" ON "SpamSignature"("pattern");

-- CreateIndex
CREATE INDEX "SpamSignature_pattern_idx" ON "SpamSignature"("pattern");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "TempEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
