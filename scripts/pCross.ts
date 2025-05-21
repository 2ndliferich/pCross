import * as hz from 'horizon/core';

/**
 * Particle effect that creates the illusion of 8 duplicates of an entity,
 * each moving in a different direction
 */
class pCross extends hz.Component<typeof pCross> {
  static propsDefinition = {
    particleAsset: { type: hz.PropTypes.Asset },
  };

  // Original position
  private startPosition: hz.Vec3 = new hz.Vec3(0, 0, 0);

  // Spawned particle entities
  private particleEntities: hz.Entity[] = [];

  // Path data for each particle
  private pathDirections: hz.Vec3[] = [];
  private pathStartTimes: number[] = [];

  // Configuration
  private particleCount = 8;
  private moveDuration = 2.0; // seconds
  private fadeDelay = 0.5; // seconds
  private resetDelay = 0.5; // seconds
  private moveDistance = 1.5; // meters

  start() {
    console.log('== MULTI-PATH PARTICLE EFFECT STARTING ==');

    try {
      // Save the original position
      this.startPosition = this.entity.transform.position.get();
      console.log('Starting position:', this.startPosition);

      if (!this.props.particleAsset) {
        console.error(
          'particleAsset property not set - assign an asset in Horizon Worlds'
        );
        return;
      }

      // Initialize and spawn the particle entities
      this.initializeParticles().catch((error) => {
        console.error('ERROR initializing particles:', error);
      });

      // Register for update events
      this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => {
        this.onUpdate(data);
      });

      console.log(
        'Multi-path effect initialized with',
        this.particleCount,
        'particles'
      );
    } catch (error) {
      console.error('ERROR in start():', error);
    }
  }
  
  private async initializeParticles() {
    try {
      const currentTime = Date.now() / 1000;

      const asset = this.props.particleAsset!;

      for (let i = 0; i < this.particleCount; i++) {
        const angle = (i / this.particleCount) * Math.PI * 2;
        const dir = new hz.Vec3(Math.sin(angle), 1.0, Math.cos(angle));
        this.pathDirections.push(dir);

        // Spawn a new particle entity with a slight offset
        const offset = new hz.Vec3(dir.x * 0.1, 0, dir.z * 0.1);
        const spawnPos = new hz.Vec3(
          this.startPosition.x + offset.x,
          this.startPosition.y,
          this.startPosition.z + offset.z
        );

        const spawned = await this.world.spawnAsset(
          asset,
          spawnPos,
          hz.Quaternion.one,
          hz.Vec3.one
        );

        this.particleEntities.push(spawned[0]);
        this.pathStartTimes.push(currentTime + i * 0.1);
      }

      console.log('Spawned', this.particleEntities.length, 'particle entities');
    } catch (error) {
      console.error('ERROR in initializeParticles():', error);
    }
  }

  // Called every frame to update all particles
  private onUpdate(_data: { deltaTime: number }) {
    try {
      const currentTime = Date.now() / 1000;

      for (let i = 0; i < this.particleEntities.length; i++) {
        const startTime = this.pathStartTimes[i];
        const elapsed = currentTime - startTime;
        const dir = this.pathDirections[i];
        const particle = this.particleEntities[i];

        if (elapsed < this.moveDuration) {
          const progress = elapsed / this.moveDuration;
          const distance = this.moveDistance * progress;
          const newPos = new hz.Vec3(
            this.startPosition.x + dir.x * distance,
            this.startPosition.y + dir.y * distance,
            this.startPosition.z + dir.z * distance
          );
          particle.transform.position.set(newPos);
        } else if (elapsed < this.moveDuration + this.fadeDelay) {
          particle.setVisibilityForPlayers([], hz.PlayerVisibilityMode.VisibleTo);
        } else if (elapsed >= this.moveDuration + this.fadeDelay + this.resetDelay) {
          this.pathStartTimes[i] = currentTime;
          particle.transform.position.set(this.startPosition);
          particle.resetVisibilityForPlayers();
        }
      }
    } catch (error) {
      console.error('ERROR in onUpdate:', error);
    }
  }

  // Called when script is removed or scene is exited
  onDestroy() {
    try {
      // Reset entity to original position and make visible
      for (const particle of this.particleEntities) {
        particle.transform.position.set(this.startPosition);
        particle.resetVisibilityForPlayers();
        this.world.deleteAsset(particle, true).catch(() => {});
      }

      this.particleEntities = [];
      this.pathDirections = [];
      this.pathStartTimes = [];
    } catch (error) {
      console.error('ERROR in onDestroy:', error);
    }
  }
}

hz.Component.register(pCross);
