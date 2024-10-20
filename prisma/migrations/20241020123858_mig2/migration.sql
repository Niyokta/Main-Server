-- CreateTable
CREATE TABLE "Project" (
    "project_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "client_id" INTEGER NOT NULL,
    "category" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "skills_required" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "max_budget" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "assigned_to" INTEGER,
    "closing_price" INTEGER,
    "proposal_count" INTEGER NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMP(3),
    "payment_status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "bid_id" SERIAL NOT NULL,
    "freelancer_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "bidding_price" INTEGER NOT NULL,
    "freelancer_name" TEXT NOT NULL,
    "proposal" TEXT NOT NULL,
    "completion_time" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_rating" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("bid_id")
);

-- CreateIndex
CREATE INDEX "Project_client_id_idx" ON "Project"("client_id");

-- CreateIndex
CREATE INDEX "Bid_project_id_idx" ON "Bid"("project_id");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;
