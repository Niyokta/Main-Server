-- DropIndex
DROP INDEX "Users_phoneNumber_key";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
