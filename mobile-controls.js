// Create and export the mobile controls manager
export class MobileControlsManager {
    constructor(game, canvas, player, keys) {
        this.game = game;
        this.canvas = canvas;
        this.player = player;
        this.keys = keys;
        this.touchControls = null;
        
        this.init();
        this.setupResizeHandlers();
    }

    init() {
        // Add viewport meta for better mobile experience
        this.addViewportMeta();
        
        // Create touch controls
        this.touchControls = this.createTouchControls();
        document.body.appendChild(this.touchControls);
        
        // Initially hide controls
        this.hideControls();
    }

    addViewportMeta() {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
    }

    createTouchControls() {
        const touchControls = document.createElement('div');
        Object.assign(touchControls.style, {
            position: 'fixed',
            bottom: '40px',
            left: '0',
            width: '100%',
            display: 'none',
            justifyContent: 'space-between',
            padding: '0 20px',
            zIndex: '100',
            pointerEvents: 'none'
        });

        const [leftButton, rightButton, shootButton] = this.createButtons();
        
        // Make buttons receive touch events
        [leftButton, rightButton, shootButton].forEach(btn => {
            btn.style.pointerEvents = 'auto';
        });

        const moveButtons = this.createMoveButtonContainer(leftButton, rightButton);
        
        touchControls.appendChild(moveButtons);
        touchControls.appendChild(shootButton);

        return touchControls;
    }

    createButtons() {
        const leftButton = document.createElement('button');
        const rightButton = document.createElement('button');
        const shootButton = document.createElement('button');

        [leftButton, rightButton, shootButton].forEach(button => {
            this.styleButton(button);
        });

        leftButton.innerHTML = '←';
        rightButton.innerHTML = '→';
        shootButton.innerHTML = '●';

        this.addButtonListeners(leftButton, rightButton, shootButton);

        return [leftButton, rightButton, shootButton];
    }

    styleButton(button) {
        Object.assign(button.style, {
            width: '80px',
            height: '80px',
            borderRadius: '20%',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            border: '3px solid white',
            color: 'white',
            fontSize: '30px',
            touchAction: 'manipulation',
            userSelect: 'none',
            position: 'relative',
            cursor: 'pointer',
            margin: '0 10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            outline: 'none'
        });
    }

    createMoveButtonContainer(leftButton, rightButton) {
        const moveButtons = document.createElement('div');
        moveButtons.style.display = 'flex';
        moveButtons.style.gap = '20px';
        moveButtons.appendChild(leftButton);
        moveButtons.appendChild(rightButton);
        return moveButtons;
    }

    addButtonListeners(leftButton, rightButton, shootButton) {
        this.addTouchListener(leftButton, 'a');
        this.addTouchListener(rightButton, 'd');
        
        // Special handling for shoot button
        const handleShoot = (pressed) => (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.keys.space.pressed = pressed;
            
            // If pressing the button, trigger an immediate shot
            if (pressed && this.player.canShoot) {
                const event = new KeyboardEvent('keydown', { key: ' ' });
                window.dispatchEvent(event);
            }
            
            // If releasing the button, reset canShoot
            if (!pressed) {
                this.player.canShoot = true;
                const event = new KeyboardEvent('keyup', { key: ' ' });
                window.dispatchEvent(event);
            }
        };

        shootButton.addEventListener('touchstart', handleShoot(true), { passive: false });
        shootButton.addEventListener('touchend', handleShoot(false), { passive: false });
        shootButton.addEventListener('touchcancel', handleShoot(false), { passive: false });
    }

    addTouchListener(button, key) {
        const handleTouch = (pressed) => (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.keys[key].pressed = pressed;
        };

        button.addEventListener('touchstart', handleTouch(true), { passive: false });
        button.addEventListener('touchend', handleTouch(false), { passive: false });
        button.addEventListener('touchcancel', handleTouch(false), { passive: false });
    }

    setupResizeHandlers() {
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('orientationchange', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        if (this.player.position) {
            this.player.position.x = this.canvas.width/2 - this.player.width/2;
            this.player.position.y = this.canvas.height - this.player.height - 20;
        }
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    showControls() {
        if (this.isMobile()) {
            this.touchControls.style.display = 'flex';
        }
    }

    hideControls() {
        this.touchControls.style.display = 'none';
    }

    adjustEndScreenForMobile(buttonContainer) {
        if (this.isMobile()) {
            buttonContainer.style.flexDirection = 'column';
            buttonContainer.style.width = '80%';
            buttonContainer.style.maxWidth = '300px';
            
            const buttons = buttonContainer.getElementsByTagName('button');
            Array.from(buttons).forEach(button => {
                button.style.width = '100%';
            });
        }
    }
} 
