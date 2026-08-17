using Microsoft.EntityFrameworkCore;
using MiniTask.Domain.Entities;

namespace MiniTask.Infrastructure.Persistence;

public sealed class MiniTaskDbContext(
    DbContextOptions<MiniTaskDbContext> options)
    : DbContext(options)
{
    public DbSet<TaskCategory> TaskCategories => Set<TaskCategory>();

    public DbSet<TaskItem> TaskItems => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(MiniTaskDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}