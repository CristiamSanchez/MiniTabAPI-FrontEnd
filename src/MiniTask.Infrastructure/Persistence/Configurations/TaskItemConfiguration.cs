using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MiniTask.Domain.Entities;

namespace MiniTask.Infrastructure.Persistence.Configurations;

public sealed class TaskItemConfiguration
    : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.ToTable("task_items");

        builder.HasKey(task => task.Id);

        builder.Property(task => task.Id)
            .HasColumnName("id");

        builder.Property(task => task.Title)
            .HasColumnName("title")
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(task => task.Description)
            .HasColumnName("description")
            .HasMaxLength(1000);

        builder.Property(task => task.DueDateUtc)
            .HasColumnName("due_date_utc");

        builder.Property(task => task.IsCompleted)
            .HasColumnName("is_completed")
            .IsRequired();

        builder.Property(task => task.CompletedAtUtc)
            .HasColumnName("completed_at_utc");

        builder.Property(task => task.CreatedAtUtc)
            .HasColumnName("created_at_utc")
            .IsRequired();

        builder.Property(task => task.CategoryId)
            .HasColumnName("category_id")
            .IsRequired();

        builder.HasIndex(task => task.CategoryId);
    }
}