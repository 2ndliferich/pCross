# pCross - Multi-Directional Particle Effect for Horizon Worlds

## Overview
pCross is a TypeScript component for Meta Horizon Worlds that creates an engaging particle effect. It simulates multiple particles moving outward from a central point in different directions, creating a dynamic visual effect that can be used for various in-game elements like magical spells, power-ups, or environmental effects.

## Features

- **Multi-directional Movement**: Creates 8 particle paths moving in different directions from the origin
- **Configurable Parameters**: Customize the effect through various parameters:
  - `moveDuration`: How long each particle moves (default: 2.0s)
  - `fadeDelay`: Delay before particles fade out (default: 0.5s)
  - `resetDelay`: Delay before resetting the effect (default: 0.5s)
  - `moveDistance`: How far particles travel (default: 1.5m)
  - `cycleDuration`: Time between switching visible particles (default: 0.05s)
- **Smooth Animation**: Uses interpolation for fluid motion
- **Automatic Cleanup**: Properly cleans up resources when the component is destroyed

## How It Works

The effect works by:
1. Creating 8 different path directions in a circular pattern
2. Cycling through these paths to create the illusion of multiple particles
3. Each particle moves outward and upward before fading out
4. The effect repeats continuously

## Usage

1. Attach the `pCross` script to an empty entity in your Horizon Worlds scene
2. The script will automatically start when the scene loads
3. The effect will be centered on the entity's starting position

## Customization

You can modify the following properties in the script to customize the effect:

- `particleCount`: Number of different paths (default: 8)
- `moveDuration`: Duration of the outward movement in seconds
- `fadeDelay`: Delay before fading out
- `resetDelay`: Delay before resetting the particle
- `moveDistance`: How far the particles travel
- `cycleDuration`: Time between switching visible particles

## Dependencies

- Horizon Worlds TypeScript definitions (`horizon/core`)

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

2ndLife Rich

## Repository

[GitHub Repository](https://github.com/2ndliferich/pCross)
