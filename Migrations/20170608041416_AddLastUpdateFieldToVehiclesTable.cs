using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Vega.Migrations
{
    public partial class AddLastUpdateFieldToVehiclesTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isRegistered",
                table: "Vehicles",
                newName: "IsRegistered");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdate",
                table: "Vehicles",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastUpdate",
                table: "Vehicles");

            migrationBuilder.RenameColumn(
                name: "IsRegistered",
                table: "Vehicles",
                newName: "isRegistered");
        }
    }
}
