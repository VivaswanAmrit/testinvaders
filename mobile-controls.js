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
        // Add viewport meta
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
        touchControls.style.position = 'fixed';
        touchControls.style.bottom = '20px';
        touchControls.style.left = '0';
        touchControls.style.width = '100%';
        touchControls.style.display = 'none';
        touchControls.style.justifyContent = 'space-between';
        touchControls.style.padding = '0 20px';
        touchControls.style.zIndex = '100';

        const [leftButton, rightButton, shootButton] = this.createButtons();
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
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            border: '2px solid white',
            color: 'white',
            fontSize: '24px',
            touchAction: 'manipulation',
            userSelect: 'none'
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
        this.addTouchListener(shootButton, 'space');
    }

    addTouchListener(button, key) {
        try {
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys[key].pressed = true;
            });

            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys[key].pressed = false;
            });
        } catch (error) {
            console.warn('Touch events not supported:', error);
        }
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
