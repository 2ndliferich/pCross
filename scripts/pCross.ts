import * as hz from 'horizon/core';

/**
 * Particle effect that creates the illusion of 8 duplicates of an entity,
 * each moving in a different direction
 */
class pCross extends hz.Component<typeof pCross> {
  // Original position
  private startPosition: hz.Vec3 = new hz.Vec3(0, 0, 0);
  
  // Particle path data
  private pathPositions: hz.Vec3[] = [];
  private pathStartTimes: number[] = [];
  private currentPathIndex: number = 0;
  
  // Configuration
  private particleCount: number = 8;
  private moveDuration: number = 2.0;  // seconds
  private fadeDelay: number = 0.5;     // seconds
  private resetDelay: number = 0.5;    // seconds
  private moveDistance: number = 1.5;  // meters
  private cycleDuration: number = 0.05; // seconds between path changes
  private lastCycleTime: number = 0;

  start() {
    console.log('== MULTI-PATH PARTICLE EFFECT STARTING ==');
    
    try {
      // Save the original position
      this.startPosition = this.entity.transform.position.get();
      console.log('Starting position:', this.startPosition);
      
      // Initialize our particle paths
      this.initializePaths();
      
      // Set our cycle start time
      this.lastCycleTime = Date.now() / 1000;
      
      // Register for update events
      this.connectLocalBroadcastEvent(
        hz.World.onUpdate,
        this.onUpdate.bind(this)
      );
      
      console.log('Multi-path effect initialized with', this.particleCount, 'paths');
    } catch (error) {
      console.error('ERROR in start():', error);
    }
  }
  
  private initializePaths() {
    try {
      const currentTime = Date.now() / 1000;
      
      // Create different paths in various directions
      for (let i = 0; i < this.particleCount; i++) {
        // Calculate angle for paths distributed in a circle
        const angle = (i / this.particleCount) * Math.PI * 2;
        
        // Create path direction vectors
        // Some go more up, some more to the sides
        const dirX = Math.sin(angle);
        const dirZ = Math.cos(angle);
        
        // Create starting positions with small offsets
        const offsetX = dirX * 0.1;
        const offsetZ = dirZ * 0.1;
        
        // Create the starting position for this path
        const pathStart = new hz.Vec3(
          this.startPosition.x + offsetX,
          this.startPosition.y,
          this.startPosition.z + offsetZ
        );
        
        // Store the path data
        this.pathPositions.push(pathStart);
        
        // Stagger the start times slightly for more natural effect
        this.pathStartTimes.push(currentTime + (i * 0.1));
      }
      
      console.log('Created', this.pathPositions.length, 'particle paths');
    } catch (error) {
      console.error('ERROR in initializePaths():', error);
    }
  }

  // Called every frame to update all paths and handle cycling
  private onUpdate(data: { deltaTime: number }) {
    try {
      const currentTime = Date.now() / 1000;
      
      // Calculate elapsed time for the current path
      if (this.currentPathIndex < this.pathPositions.length) {
        const pathStartTime = this.pathStartTimes[this.currentPathIndex];
        const elapsedTime = currentTime - pathStartTime;
        
        // Calculate the position for this path at this moment
        if (elapsedTime < this.moveDuration) {
          // PHASE 1: Moving outward
          const progress = elapsedTime / this.moveDuration;
          
          // Get the direction based on the current index
          const angle = (this.currentPathIndex / this.particleCount) * Math.PI * 2;
          const dirX = Math.sin(angle);
          const dirY = 1.0; // Upward motion
          const dirZ = Math.cos(angle);
          
          // Calculate distance to move based on progress
          const distance = this.moveDistance * progress;
          
          // Calculate new position
          const newPosition = new hz.Vec3(
            this.pathPositions[this.currentPathIndex].x + (dirX * distance),
            this.pathPositions[this.currentPathIndex].y + (dirY * distance),
            this.pathPositions[this.currentPathIndex].z + (dirZ * distance)
          );
          
          // Set the entity's position
          this.entity.transform.position.set(newPosition);
        } 
        else if (elapsedTime >= this.moveDuration && 
                 elapsedTime < this.moveDuration + this.fadeDelay) {
          // PHASE 2: Fade out - hide the entity
          this.entity.setVisibilityForPlayers([], hz.PlayerVisibilityMode.VisibleTo);
        }
        else if (elapsedTime >= this.moveDuration + this.fadeDelay + this.resetDelay) {
          // PHASE 3: Reset - restart this path
          this.pathStartTimes[this.currentPathIndex] = currentTime;
        }
      }
      
      // Switch to next path at regular intervals to create multiple-entity illusion
      if (currentTime - this.lastCycleTime > this.cycleDuration) {
        // Go to next path
        this.currentPathIndex = (this.currentPathIndex + 1) % this.particleCount;
        this.lastCycleTime = currentTime;
        
        // Make sure entity is visible when showing a different path
        this.entity.resetVisibilityForPlayers();
        
        // Reset position for the new path
        if (this.currentPathIndex < this.pathPositions.length) {
          // Get current progress of this path
          const pathTime = currentTime - this.pathStartTimes[this.currentPathIndex];
          
          if (pathTime < this.moveDuration) {
            // If still in movement phase, calculate current position
            const progress = pathTime / this.moveDuration;
            const angle = (this.currentPathIndex / this.particleCount) * Math.PI * 2;
            const dirX = Math.sin(angle);
            const dirY = 1.0;
            const dirZ = Math.cos(angle);
            const distance = this.moveDistance * progress;
            
            const newPosition = new hz.Vec3(
              this.pathPositions[this.currentPathIndex].x + (dirX * distance),
              this.pathPositions[this.currentPathIndex].y + (dirY * distance),
              this.pathPositions[this.currentPathIndex].z + (dirZ * distance)
            );
            
            this.entity.transform.position.set(newPosition);
          } else {
            // If in fade/reset phase, move to start position
            this.entity.transform.position.set(this.pathPositions[this.currentPathIndex]);
          }
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
      this.entity.transform.position.set(this.startPosition);
      this.entity.resetVisibilityForPlayers();
      
      // Clear arrays
      this.pathPositions = [];
      this.pathStartTimes = [];
    } catch (error) {
      console.error('ERROR in onDestroy:', error);
    }
  }
}

hz.Component.register(pCross);