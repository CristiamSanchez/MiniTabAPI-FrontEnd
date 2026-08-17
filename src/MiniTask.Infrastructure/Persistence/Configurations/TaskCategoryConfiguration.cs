using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MiniTask.Domain.Entities;

namespace MiniTask.Infrastructure.Persistence.Configurations;

public sealed class TaskCategoryConfiguration
    : IEntityTypeConfiguration<TaskCategory>
{
    public void Configure(EntityTypeBuilder<TaskCategory> builder)
    {
        builder.ToTable("task_categories");

        builder.HasKey(category => category.Id);

        builder.Property(category => category.Id)
            .HasColumnName("id");

        builder.Property(category => category.Name)
            .HasColumnName("name")
            .HasMaxLength(80)
            .IsRequired();

        builder.Property(category => category.CreatedAtUtc)
            .HasColumnName("created_at_utc")
            .IsRequired();

        builder.HasIndex(category => category.Name)
            .IsUnique();

        builder.HasMany(category => category.Tasks)
            .WithOne(task => task.Category)
            .HasForeignKey(task => task.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Navigation(category => category.Tasks)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}