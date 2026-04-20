# Contributing to Healthcare Sample App (ASP.NET Core)

Thank you for your interest in contributing to the Healthcare Sample App! This document provides guidelines and instructions for contributing to this project.

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download) or later
- [Visual Studio Code](https://code.visualstudio.com/) or [Visual Studio](https://visualstudio.microsoft.com/)
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/telerik/healthcare-sample-app-core.git
   cd healthcare-sample-app-core
   ```

2. Restore dependencies and build:
   ```bash
   dotnet build HealthcareApp.sln
   ```

3. Run the application:
   ```bash
   dotnet run
   ```

The application will start at `https://localhost:5263/aspnet-core-healthcare/`

## Development Workflow

1. **Create a feature branch** from `master`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit with clear, descriptive messages:
   ```bash
   git commit -m "feat: add description of your change"
   ```

3. **Test your changes** locally to ensure the application runs correctly

4. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

## Submitting a Pull Request

1. Create a pull request against the `master` branch with a clear title and description
2. Include any relevant issue numbers using `#issue-number`
3. Your PR will automatically be deployed to a staging environment (accessible to Progress employees only)
4. Address any feedback or review comments
5. Upon successful merge, your changes will be automatically deployed to: https://demos.telerik.com/aspnet-core-healthcare/

## Code Guidelines

- Follow the existing code style and conventions
- Ensure all changes are properly tested
- Keep commits focused and logical
- Write clear commit messages

## Questions or Issues?

If you have questions or run into issues, please open an issue on the repository.

Thank you for contributing!
