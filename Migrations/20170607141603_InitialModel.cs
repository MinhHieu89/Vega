using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Vega.Migrations
{
    public partial class InitialModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Makes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Makes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Models",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    MakeId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Models", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Models_Makes_MakeId",
                        column: x => x.MakeId,
                        principalTable: "Makes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Models_MakeId",
                table: "Models",
                column: "MakeId");

            migrationBuilder.Sql("INSERT INTO Makes (Name) VALUES ('Make1')");
            migrationBuilder.Sql("INSERT INTO Makes (Name) VALUES ('Make2')");
            migrationBuilder.Sql("INSERT INTO Makes (Name) VALUES ('Make3')");

            migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Make1-ModelA', (SELECT ID FROM Makes WHERE Name='Make1'))");
            migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Make1-ModelB', (SELECT ID FROM Makes WHERE Name='Make1'))");
            migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Make1-ModelC', (SELECT ID FROM Makes WHERE Name='Make1'))");
            migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Make2-ModelA', (SELECT ID FROM Makes WHERE Name='Make2'))");
            migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Make2-ModelB', (SELECT ID FROM Makes WHERE Name='Make2'))");
            migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Make2-ModelC', (SELECT ID FROM Makes WHERE Name='Make2'))");
            migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Make3-ModelA', (SELECT ID FROM Makes WHERE Name='Make3'))");
            migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Make3-ModelB', (SELECT ID FROM Makes WHERE Name='Make3'))");
            migrationBuilder.Sql("INSERT INTO Models (Name, MakeId) VALUES ('Make3-ModelC', (SELECT ID FROM Makes WHERE Name='Make3'))");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Models");

            migrationBuilder.DropTable(
                name: "Makes");
        }
    }
}
