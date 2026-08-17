using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiniTask.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "task_categories",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    created_at_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_task_categories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "task_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    due_date_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_completed = table.Column<bool>(type: "boolean", nullable: false),
                    completed_at_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    category_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_task_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_task_items_task_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "task_categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_task_categories_name",
                table: "task_categories",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_task_items_category_id",
                table: "task_items",
                column: "category_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "task_items");

            migrationBuilder.DropTable(
                name: "task_categories");
        }
    }
}
