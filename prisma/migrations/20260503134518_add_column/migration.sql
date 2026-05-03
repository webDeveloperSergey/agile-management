-- CreateTable
CREATE TABLE "columns" (
    "column_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "board_id" UUID NOT NULL,

    CONSTRAINT "columns_pkey" PRIMARY KEY ("column_id")
);

-- AddForeignKey
ALTER TABLE "columns" ADD CONSTRAINT "columns_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("board_id") ON DELETE RESTRICT ON UPDATE CASCADE;
