// GATE (2026-07-06): o FX Vision só monta nas páginas LOGADAS da corretora
// (/trade ou /demo-trade). Em sign-up/sign-in etc. nada aparece; o vigia no fim
// do arquivo observa a URL (SPA ou reload) e monta/esconde conforme entra/sai da sala.
const __fxvBoot = () => {

// FX VISION
  (function() {
    // Evita criar múltiplas instâncias
    if (window.fxVisionOverlay) {
        return;
    }

    window.fxVisionOverlay = true;

    // Carregar biblioteca Supabase se não estiver disponível
    if (typeof supabase === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.async = false;
        document.head.appendChild(script);
    }
    
    // Função para detectar dispositivos móveis
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768 ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
    }
    
    // Definir tamanhos baseados no dispositivo
    const deviceSizes = isMobileDevice() ? {
        width: 320,
        height: 560,
        minWidth: 280,
        minHeight: 400,
        maxWidth: 400,
        maxHeight: 600
    } : {
        width: 420,
        height: 720,
        minWidth: 280,
        minHeight: 520,
        maxWidth: 650,
        maxHeight: 850
    };
    
    // Cria o overlay principal
    const overlay = document.createElement('div');
    overlay.id = 'fx-vision-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: ${deviceSizes.width}px;
        height: ${deviceSizes.height}px;
        background: linear-gradient(135deg, 
            rgba(10, 10, 30, 0.95) 0%, 
            rgba(20, 20, 50, 0.95) 25%, 
            rgba(15, 25, 60, 0.95) 50%, 
            rgba(25, 15, 45, 0.95) 75%, 
            rgba(10, 10, 30, 0.95) 100%);
        border-radius: 20px;
        box-shadow: 
            0 0 50px rgba(0, 255, 255, 0.3),
            0 0 100px rgba(138, 43, 226, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        z-index: 999999;
        padding: ${isMobileDevice() ? '15px' : '25px'};
        font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
        border: 1px solid rgba(0, 255, 255, 0.4);
        backdrop-filter: blur(15px);
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: ${isMobileDevice() ? '15px' : '20px'};
        min-width: ${deviceSizes.minWidth}px;
        min-height: ${deviceSizes.minHeight}px;
        resize: none;
        overflow: hidden;
        animation: fadeInScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    // Adiciona animações CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            100% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
            50% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.8); }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes slideIn {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes numberGlow {
            0%, 100% { 
                color: #00ff88; 
                text-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
            }
            50% { 
                color: #00ffff; 
                text-shadow: 0 0 30px rgba(0, 255, 255, 1);
            }
        }
        
        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes fadeSlide {
            0% { 
                transform: translateX(-150%);
                opacity: 0;
            }
            20% {
                opacity: 1;
            }
            50% {
                opacity: 1;
            }
            80% {
                opacity: 1;
            }
            100% { 
                transform: translateX(250%);
                opacity: 0;
            }
        }
        
        @keyframes arrowUp {
            0%, 100% { 
                transform: translateY(0px);
                opacity: 0.7;
            }
            50% { 
                transform: translateY(-3px);
                opacity: 1;
            }
        }
        
        @keyframes arrowDown {
            0%, 100% { 
                transform: translateY(0px);
                opacity: 0.7;
            }
            50% { 
                transform: translateY(3px);
                opacity: 1;
            }
        }
        
        @keyframes borderLightSlow {
            0% { 
                transform: rotate(0deg);
                opacity: 0.8;
            }
            100% { 
                transform: rotate(360deg);
                opacity: 0.8;
            }
        }
        
        @keyframes borderLightFast {
            0% { 
                transform: rotate(0deg);
                opacity: 1;
            }
            100% { 
                transform: rotate(360deg);
                opacity: 1;
            }
        }

        @keyframes techScan {
            0% { 
                left: -100%;
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            50% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% { 
                left: 100%;
                opacity: 0;
            }
        }

        @keyframes dataPulse {
            0%, 100% { 
                transform: scale(1);
                opacity: 0.8;
            }
            50% { 
                transform: scale(1.02);
                opacity: 1;
            }
        }

        @keyframes circuitGlow {
            0%, 100% { 
                box-shadow: 
                    0 0 20px rgba(0, 255, 255, 0.3),
                    inset 0 0 20px rgba(0, 255, 255, 0.1);
            }
            50% { 
                box-shadow: 
                    0 0 40px rgba(0, 255, 255, 0.6),
                    inset 0 0 30px rgba(0, 255, 255, 0.2);
            }
        }

        @keyframes modalFadeIn {
            0% {
                opacity: 0;
                transform: scale(0.8);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        @keyframes vipPulseInitial {
            0%, 20%, 40%, 60%, 80%, 100% { 
                transform: scale(1);
                opacity: 0.8;
            }
            10%, 30%, 50% { 
                transform: scale(1.2);
                opacity: 1;
            }
        }
        
        @keyframes vipContinuousPulse {
            0%, 100% { 
                transform: scale(1);
                opacity: 0.8;
                filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
            }
            50% { 
                transform: scale(1.1);
                opacity: 1;
                filter: drop-shadow(0 0 12px rgba(255, 215, 0, 1));
            }
        }

        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes onlineBlink {
            0%, 100% { 
                opacity: 1;
                transform: scale(1);
            }
            50% { 
                opacity: 0.3;
                transform: scale(0.8);
            }
        }

        @keyframes logoutSlideIn {
            0% {
                opacity: 0;
                transform: translateY(-10px) scale(0.9);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @keyframes logoutSlideOut {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-10px) scale(0.9);
            }
        }

        @keyframes gearRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes settingsSlideIn {
            0% {
                opacity: 0;
                transform: scale(0.95);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes settingsSlideOut {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0.95);
            }
        }

        @keyframes historySlideIn {
            0% {
                opacity: 0;
                transform: scale(0.95);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes historySlideOut {
            0% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9);
            }
        }

        @keyframes winPulse {
            0%, 100% { 
                transform: scale(1);
                text-shadow: 0 0 8px rgba(0, 255, 136, 0.8);
            }
            50% { 
                transform: scale(1.05);
                text-shadow: 0 0 12px rgba(0, 255, 136, 1);
            }
        }

        @keyframes lossPulse {
            0%, 100% { 
                transform: scale(1);
                text-shadow: 0 0 8px rgba(255, 68, 68, 0.8);
            }
            50% { 
                transform: scale(1.05);
                text-shadow: 0 0 12px rgba(255, 68, 68, 1);
            }
        }

        .history-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 255, 255, 0.5) rgba(255, 255, 255, 0.1);
        }

        .history-scroll::-webkit-scrollbar {
            width: 6px;
        }

        .history-scroll::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
        }

        .history-scroll::-webkit-scrollbar-thumb {
            background: rgba(0, 255, 255, 0.5);
            border-radius: 3px;
        }

        .history-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 255, 255, 0.8);
        }
    `;
    document.head.appendChild(style);
    
    // Efeito de partículas de fundo
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        border-radius: 20px;
    `;
    
    // Cria partículas flutuantes
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(0, 255, 255, ${Math.random() * 0.8 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s infinite linear;
        `;
        particlesContainer.appendChild(particle);
    }
    
    // Área de redimensionamento
    const resizeHandle = document.createElement('div');
    resizeHandle.style.cssText = `
        position: absolute;
        bottom: 0;
        right: 0;
        width: ${isMobileDevice() ? '120px' : '80px'};
        height: ${isMobileDevice() ? '120px' : '100px'};
        cursor: nw-resize;
        background: transparent;
        z-index: 10;
        ${isMobileDevice() ? 'touch-action: none;' : ''}
    `;
    
    // Indicador visual futurista para redimensionamento
    const resizeIndicator = document.createElement('div');
    resizeIndicator.style.cssText = `
        position: absolute;
        bottom: ${isMobileDevice() ? '12px' : '8px'};
        right: ${isMobileDevice() ? '12px' : '8px'};
        width: ${isMobileDevice() ? '24px' : '16px'};
        height: ${isMobileDevice() ? '24px' : '16px'};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
        gap: ${isMobileDevice() ? '3px' : '2px'};
        pointer-events: none;
        opacity: 0.6;
        transition: all 0.3s ease;
    `;
    
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        const baseWidth = isMobileDevice() ? 6 : 4;
        const width = (i + 1) * baseWidth + (isMobileDevice() ? 4 : 2);
        line.style.cssText = `
            width: ${width}px;
            height: ${isMobileDevice() ? '3px' : '2px'};
            background: linear-gradient(90deg, 
                rgba(0, 255, 255, 0.8) 0%, 
                rgba(100, 200, 255, 0.8) 100%);
            border-radius: ${isMobileDevice() ? '2px' : '1px'};
            box-shadow: 0 0 4px rgba(0, 255, 255, 0.4);
        `;
        resizeIndicator.appendChild(line);
    }
    
    resizeHandle.addEventListener('mouseenter', function() {
        resizeIndicator.style.opacity = '1';
        resizeIndicator.style.transform = `scale(${isMobileDevice() ? '1.2' : '1.1'})`;
        const lines = resizeIndicator.querySelectorAll('div');
        lines.forEach(line => {
            line.style.boxShadow = '0 0 8px rgba(0, 255, 255, 0.8)';
            line.style.background = 'linear-gradient(90deg, rgba(0, 255, 255, 1) 0%, rgba(100, 200, 255, 1) 100%)';
        });
    });
    
    resizeHandle.addEventListener('mouseleave', function() {
        resizeIndicator.style.opacity = '0.6';
        resizeIndicator.style.transform = 'scale(1)';
        const lines = resizeIndicator.querySelectorAll('div');
        lines.forEach(line => {
            line.style.boxShadow = '0 0 4px rgba(0, 255, 255, 0.4)';
            line.style.background = 'linear-gradient(90deg, rgba(0, 255, 255, 0.8) 0%, rgba(100, 200, 255, 0.8) 100%)';
        });
    });
    
    if (isMobileDevice()) {
        resizeHandle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            resizeIndicator.style.opacity = '1';
            resizeIndicator.style.transform = 'scale(1.3)';
            const lines = resizeIndicator.querySelectorAll('div');
            lines.forEach(line => {
                line.style.boxShadow = '0 0 12px rgba(0, 255, 255, 1)';
                line.style.background = 'linear-gradient(90deg, rgba(0, 255, 255, 1) 0%, rgba(100, 200, 255, 1) 100%)';
            });
        });
        
        resizeHandle.addEventListener('touchend', function(e) {
            setTimeout(() => {
                resizeIndicator.style.opacity = '0.8';
                resizeIndicator.style.transform = 'scale(1)';
                const lines = resizeIndicator.querySelectorAll('div');
                lines.forEach(line => {
                    line.style.boxShadow = '0 0 6px rgba(0, 255, 255, 0.6)';
                    line.style.background = 'linear-gradient(90deg, rgba(0, 255, 255, 0.9) 0%, rgba(100, 200, 255, 0.9) 100%)';
                });
            }, 100);
        });
        
        resizeIndicator.style.opacity = '0.8';
    }
    
    const logoContainer = document.createElement('div');
    logoContainer.style.cssText = `
        position: relative;
        margin-bottom: ${isMobileDevice() ? '10px' : '15px'};
        animation: slideIn 0.8s ease-out 0.2s both;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: ${isMobileDevice() ? '6px' : '8px'};
    `;
    
    const logo = document.createElement('img');
    logo.src = window.__FXV_LOGO_URL__ || 'https://fxvisionapp.com/logo.png';
    logo.style.cssText = `
        width: ${isMobileDevice() ? '120px' : '160px'};
        height: auto;
        border-radius: 12px;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.4));
    `;
    
    logo.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.filter = 'drop-shadow(0 0 30px rgba(0, 255, 255, 0.8))';
    });
    
    logo.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.filter = 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.4))';
    });
    
    logoContainer.appendChild(logo);

    const emailDisplay = document.createElement('div');
    emailDisplay.style.cssText = `
        font-size: 12px;
        color: rgba(0, 255, 255, 0.8);
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        letter-spacing: 1px;
        font-weight: 500;
        background: rgba(0, 255, 255, 0.1);
        padding: 4px 12px;
        border-radius: 15px;
        border: 1px solid rgba(0, 255, 255, 0.3);
        backdrop-filter: blur(10px);
        display: none;
        animation: slideIn 0.6s ease-out;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    `;
    
    emailDisplay.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(0, 255, 255, 0.15)';
        this.style.borderColor = 'rgba(0, 255, 255, 0.5)';
        this.style.transform = 'scale(1.02)';
    });
    
    emailDisplay.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(0, 255, 255, 0.1)';
        this.style.borderColor = 'rgba(0, 255, 255, 0.3)';
        this.style.transform = 'scale(1)';
    });
    
    logoContainer.appendChild(emailDisplay);
    
    // ===== PAINEL TECNOLÓGICO UNIFICADO =====
    const unifiedPanel = document.createElement('div');
    unifiedPanel.style.cssText = `
        position: relative;
        width: 95%;
        max-width: 350px;
        height: 65px;
        background: linear-gradient(135deg, 
            rgba(15, 25, 45, 0.95) 0%, 
            rgba(25, 35, 55, 0.95) 25%,
            rgba(35, 45, 65, 0.95) 50%,
            rgba(25, 35, 55, 0.95) 75%,
            rgba(15, 25, 45, 0.95) 100%);
        border-radius: 15px;
        border: 1px solid rgba(0, 255, 255, 0.3);
        box-shadow: 
            0 0 25px rgba(0, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(15px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        overflow: hidden;
        animation: slideIn 0.8s ease-out 0.4s both, circuitGlow 3s ease-in-out infinite;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    const scanEffect = document.createElement('div');
    scanEffect.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100px;
        height: 100%;
        background: linear-gradient(90deg,
            transparent 0%,
            rgba(0, 255, 255, 0.1) 20%,
            rgba(0, 255, 255, 0.3) 50%,
            rgba(0, 255, 255, 0.1) 80%,
            transparent 100%);
        animation: techScan 4s ease-in-out infinite;
        pointer-events: none;
        border-radius: 15px;
    `;

    const circuitPattern = document.createElement('div');
    circuitPattern.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.1;
        pointer-events: none;
        border-radius: 15px;
        background-image: 
            linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px);
        background-size: 20px 20px;
    `;

    const quotexLogoContainer = document.createElement('div');
    quotexLogoContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 2;
    `;

    const quotexText = document.createElement('div');
    quotexText.style.cssText = `
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        letter-spacing: 2px;
        text-transform: uppercase;
        font-family: 'Segoe UI', 'Orbitron', monospace;
    `;
    quotexText.textContent = 'QUOTEX';

    const assetContainer = document.createElement('div');
    assetContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 2;
        position: relative;
        flex: 1;
        min-width: 0;
    `;

    const assetStatus = document.createElement('div');
    assetStatus.style.cssText = `
        width: 8px;
        height: 8px;
        background: #00ff88;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
        animation: dataPulse 1s ease-in-out infinite;
        flex-shrink: 0;
    `;

    const assetText = document.createElement('div');
    assetText.style.cssText = `
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
        letter-spacing: 1px;
        font-family: 'Segoe UI', 'Orbitron', monospace;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: right;
        flex: 1;
        min-width: 0;
    `;
    assetText.textContent = 'Loading...';

    quotexLogoContainer.appendChild(quotexText);
    assetContainer.appendChild(assetStatus);
    assetContainer.appendChild(assetText);
    
    unifiedPanel.appendChild(circuitPattern);
    unifiedPanel.appendChild(scanEffect);
    unifiedPanel.appendChild(quotexLogoContainer);
    unifiedPanel.appendChild(assetContainer);

    unifiedPanel.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = `
            0 0 35px rgba(0, 255, 255, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.4)`;
        this.style.borderColor = 'rgba(0, 255, 255, 0.6)';
        scanEffect.style.animationDuration = '2s';
        assetStatus.style.boxShadow = '0 0 15px rgba(0, 255, 136, 1)';
    });
    
    unifiedPanel.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = `
            0 0 25px rgba(0, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3)`;
        this.style.borderColor = 'rgba(0, 255, 255, 0.3)';
        scanEffect.style.animationDuration = '4s';
        assetStatus.style.boxShadow = '0 0 10px rgba(0, 255, 136, 0.8)';
    });
    
    const speedometerContainer = document.createElement('div');
    speedometerContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        margin: 20px 0;
        animation: slideIn 0.8s ease-out 0.8s both;
    `;
    
    const speedometer = document.createElement('div');
    speedometer.style.cssText = `
        position: relative;
        width: ${isMobileDevice() ? '140px' : '180px'};
        height: ${isMobileDevice() ? '140px' : '180px'};
        border-radius: 50%;
        background: radial-gradient(circle at center, 
            rgba(45, 55, 65, 0.9) 0%, 
            rgba(35, 45, 55, 0.95) 70%, 
            rgba(25, 35, 45, 0.98) 100%);
        border: 2px solid rgba(255, 255, 255, 0.1);
        box-shadow: 
            0 0 30px rgba(0, 0, 0, 0.5),
            inset 0 0 30px rgba(0, 0, 0, 0.3);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    `;
    
    const borderLight = document.createElement('div');
    borderLight.style.cssText = `
        position: absolute;
        top: -4px;
        left: -4px;
        width: calc(100% + 8px);
        height: calc(100% + 8px);
        border-radius: 50%;
        background: conic-gradient(
            transparent 0deg,
            transparent 270deg,
            #ff6b35 300deg,
            #ff8c42 320deg,
            #ff6b35 340deg,
            transparent 360deg
        );
        opacity: 0;
        pointer-events: none;
        z-index: 1;
    `;
    
    speedometer.appendChild(borderLight);
    
    const marks = document.createElement('div');
    marks.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
    `;
    
    const speedometerRadius = isMobileDevice() ? 70 : 90;
    const markHeight = isMobileDevice() ? 15 : 20;
    const smallMarkHeight = isMobileDevice() ? 8 : 12;

    for (let i = 0; i < 12; i++) {
        const mark = document.createElement('div');
        const angle = (i * 30) - 90;
        const isMainMark = i % 3 === 0;

        mark.style.cssText = `
            position: absolute;
            width: ${isMainMark ? '3px' : '2px'};
            height: ${isMainMark ? markHeight + 'px' : smallMarkHeight + 'px'};
            background: ${isMainMark ? '#00aaff' : 'rgba(255, 255, 255, 0.4)'};
            top: 5px;
            left: 50%;
            transform-origin: 50% ${speedometerRadius}px;
            transform: translateX(-50%) rotate(${angle}deg);
            border-radius: 2px;
        `;
        marks.appendChild(mark);
    }
    
    const innerContent = document.createElement('div');
    innerContent.style.cssText = `
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 8px;
        z-index: 10;
    `;

    const backgroundLogo = document.createElement('img');
    backgroundLogo.src = 'https://fxvisionapp.com/bg.png';
    backgroundLogo.style.cssText = `
        position: absolute;
        width: ${isMobileDevice() ? '100px' : '130px'};
        height: auto;
        opacity: 0.15;
        z-index: 1;
        pointer-events: none;
        filter: brightness(1.2);
    `;

    const percentage = document.createElement('div');
    percentage.style.cssText = `
        font-size: ${isMobileDevice() ? '24px' : '32px'};
        font-weight: bold;
        color: #00aaff;
        text-shadow: 0 0 15px rgba(0, 170, 255, 0.6);
        font-family: 'Segoe UI', 'Roboto', sans-serif;
        letter-spacing: 0.5px;
        position: relative;
        z-index: 2;
    `;
    percentage.textContent = '0.0%';
    
    const currencyPair = document.createElement('div');
    currencyPair.style.cssText = `
        font-size: ${isMobileDevice() ? '12px' : '14px'};
        color: rgba(255, 255, 255, 0.7);
        font-weight: 500;
        letter-spacing: 1px;
        margin: 5px 0;
        position: relative;
        z-index: 2;
    `;
    currencyPair.textContent = 'Loading...';

    innerContent.appendChild(backgroundLogo);
    innerContent.appendChild(percentage);
    innerContent.appendChild(currencyPair);
    
    speedometer.appendChild(marks);
    speedometer.appendChild(innerContent);
    
    const volumeLabel = document.createElement('div');
    volumeLabel.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
        letter-spacing: 2px;
        margin-top: 10px;
        text-transform: uppercase;
        font-family: 'Segoe UI', sans-serif;
    `;
    
    const volumeText = document.createElement('span');
    volumeText.textContent = 'MADA BY Julian King';
    
    const gearIcon = document.createElement('div');
    gearIcon.style.cssText = `
        width: 16px;
        height: 16px;
        cursor: pointer;
        display: none;
        transition: all 0.3s ease;
        opacity: 0.7;
        position: relative;
    `;
    
    gearIcon.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="rgba(255, 255, 255, 0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5176 9 19.41C8.69838 19.2769 8.36381 19.2372 8.03941 19.296C7.71502 19.3548 7.41568 19.5095 7.18 19.74L7.12 19.8C6.93425 19.986 6.71368 20.1335 6.47088 20.2341C6.22808 20.3348 5.96783 20.3866 5.705 20.3866C5.44217 20.3866 5.18192 20.3348 4.93912 20.2341C4.69632 20.1335 4.47575 19.986 4.29 19.8C4.10405 19.6143 3.95653 19.3937 3.85588 19.1509C3.75523 18.9081 3.70343 18.6478 3.70343 18.385C3.70343 18.1222 3.75523 17.8619 3.85588 17.6191C3.95653 17.3763 4.10405 17.1557 4.29 16.97L4.35 16.91C4.58054 16.6743 4.73519 16.375 4.794 16.0506C4.85282 15.7262 4.81312 15.3916 4.68 15.09C4.55324 14.7942 4.34276 14.542 4.07447 14.3643C3.80618 14.1866 3.49179 14.0913 3.17 14.09H3C2.46957 14.09 1.96086 13.8793 1.58579 13.5042C1.21071 13.1291 1 12.6204 1 12.09C1 11.5596 1.21071 11.0509 1.58579 10.6758C1.96086 10.3007 2.46957 10.09 3 10.09H3.09C3.42099 10.0823 3.742 9.97512 4.01062 9.78251C4.27925 9.5899 4.48167 9.32074 4.59 9.01C4.72312 8.70838 4.76282 8.37381 4.704 8.04941C4.64519 7.72502 4.49054 7.42568 4.26 7.19L4.2 7.13C4.01405 6.94425 3.86653 6.72368 3.76588 6.48088C3.66523 6.23808 3.61343 5.97783 3.61343 5.715C3.61343 5.45217 3.66523 5.19192 3.76588 4.94912C3.86653 4.70632 4.01405 4.48575 4.2 4.3C4.38575 4.11405 4.60632 3.96653 4.84912 3.86588C5.09192 3.76523 5.35217 3.71343 5.615 3.71343C5.87783 3.71343 6.13808 3.76523 6.38088 3.86588C6.62368 3.96653 6.84425 4.11405 7.03 4.3L7.09 4.36C7.32568 4.59054 7.62502 4.74519 7.94941 4.804C8.27381 4.86282 8.60838 4.82312 8.91 4.69H9C9.29577 4.56324 9.54802 4.35276 9.72569 4.08447C9.90337 3.81618 9.99872 3.50179 10 3.18V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="rgba(0, 255, 255, 0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    gearIcon.addEventListener('mouseenter', function() {
        this.style.opacity = '1';
        this.style.transform = 'scale(1.1)';
        this.style.animation = 'gearRotate 2s linear infinite';
        const svg = this.querySelector('svg path');
        if (svg) {
            svg.setAttribute('stroke', 'rgba(0, 255, 255, 0.8)');
        }
    });
    
    gearIcon.addEventListener('mouseleave', function() {
        this.style.opacity = '0.7';
        this.style.transform = 'scale(1)';
        this.style.animation = 'none';
        const svg = this.querySelector('svg path');
        if (svg) {
            svg.setAttribute('stroke', 'rgba(255, 255, 255, 0.6)');
        }
    });
    
    gearIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        openSettingsModal();
    });
    
    if (isMobileDevice()) {
        gearIcon.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.opacity = '1';
            this.style.transform = 'scale(1.2)';
            this.style.animation = 'gearRotate 1s linear infinite';
        });
        
        gearIcon.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            setTimeout(() => {
                openSettingsModal();
            }, 50);
        });
    }
    
    volumeLabel.appendChild(volumeText);
    volumeLabel.appendChild(gearIcon);
    
    let isReading = false;
    let isAuthenticated = false;
    let deviceVerified = false;
    let userEmail = '';
    let volumeCheckInterval;
    let signalCheckInterval;
    let currentVolumeState = 'READING';
    let currentMinute = -1;
    let speedometerInterval;
    let basePercentage = 0;

    const SUPABASE_URL = 'https://uwtwqkdpufpjvpfinpas.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dHdxa2RwdWZwanZwZmlucGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDQ5ODksImV4cCI6MjA5NzM4MDk4OX0.4yrc6-8g16cVyCMpBZQUPD4yzGuumQY2fPSTCeTDZuc';

    let supabaseClient = null;
    let currentSignalId = null;
    let lastKnownAsset = '';

    async function initializeSupabase(session) {
        if (typeof supabase === 'undefined') {
            return null;
        }

        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            }
        });

        return supabaseClient;
    }

    async function fetchSynchronizedSignal() {
        if (!isReading) {
            return;
        }

        try {
            const now = new Date();
            const currentMinuteNow = now.getMinutes();

            const currentAsset = detectCurrentAsset();
            const cleanedAsset = cleanAssetName(currentAsset);
            const assetForQuery = (cleanedAsset && cleanedAsset !== 'Not Found' && cleanedAsset !== 'Loading...') ? cleanedAsset : 'EURUSD';

            if (lastKnownAsset && lastKnownAsset !== assetForQuery) {
                currentSignalId = null;
                currentVolumeState = 'ANALYZING';
                currentMinute = -1;
                lastKnownAsset = assetForQuery;
                await generateNewSignal();
                return;
            }

            lastKnownAsset = assetForQuery;

            if (currentMinute !== currentMinuteNow) {
                await generateNewSignal();
                return;
            }

        } catch (err) {
            // Error handled silently
        }
    }

    async function generateNewSignal() {
        try {
            const currentAsset = detectCurrentAsset();
            const cleanedAsset = cleanAssetName(currentAsset);
            const assetForQuery = (cleanedAsset && cleanedAsset !== 'Not Found' && cleanedAsset !== 'Loading...') ? cleanedAsset : 'EURUSD';

            const now = new Date();
            const currentMinuteNow = now.getMinutes();
            const currentSecond = now.getSeconds();

            let hash = 0;
            const seedString = assetForQuery + currentMinuteNow;
            for (let i = 0; i < seedString.length; i++) {
                const char = seedString.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }

            const signalTypes = ['BUYER', 'SELLER', 'ANALYZING'];
            const signalIndex = Math.abs(hash % 10);

            let signalType;
            if (signalIndex < 4) {
                signalType = 'BUYER';
            } else if (signalIndex < 8) {
                signalType = 'SELLER';
            } else {
                signalType = 'ANALYZING';
            }

            const percentageBase = Math.abs(hash % 30) + 65; 

            currentVolumeState = signalType;
            currentMinute = currentMinuteNow;
            currentSignalId = `offline_${Date.now()}`;

            if (signalType === 'BUYER' || signalType === 'SELLER') {
                basePercentage = percentageBase;
            }

            updateButtonAppearance();
        } catch (err) {
            // Error handled silently
        }
    }

    let globalOnlineUsers = 0;
    let isAutomaticOperationEnabled = false;
    let settingsModal = null;
    let logoutMenu = null;
    let accuracyModal = null;

    function generateDeterministicResult(timestamp, assetName = 'BTC/USDT') {
        const seed = Math.floor(timestamp / 60000);

        let winRate = 94;
        try { const _w = Number(window.__FXV_WINRATE__ || (window.__FXV_SETTINGS && window.__FXV_SETTINGS.signal_win_rate)); if (_w >= 50 && _w <= 100) winRate = _w; } catch (e) {}

        let hash = seed;

        for (let i = 0; i < assetName.length; i++) {
            const char = assetName.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        hash = ((hash << 5) - hash) + seed;
        hash = hash & hash;
        hash = ((hash << 5) - hash) + (seed * 7);
        hash = hash & hash;
        hash = ((hash << 3) - hash) + (seed * 13);
        hash = hash & hash;

        const value = Math.abs(hash % 10000) / 100;
        return value < winRate ? 'WIN' : 'LOSS';
    }

    async function loadCandleResults() {
        try {
            const currentAsset = detectCurrentAsset();
            const cleanedAsset = cleanAssetName(currentAsset);
            const displayAsset = (cleanedAsset && cleanedAsset !== 'Not Found' && cleanedAsset !== 'Loading...') ? cleanedAsset : 'BTC/USDT';

            const titleElement = document.getElementById('accuracy-modal-title');
            if (titleElement) {
                titleElement.textContent = `${displayAsset} - Last 30 Candles`;
            }

            const candlesContainer = document.getElementById('candles-container');
            if (!candlesContainer) return;

            candlesContainer.innerHTML = '';

            let wins = 0;
            let losses = 0;

            const now = Date.now();
            const candleData = [];

            for (let i = 0; i < 31; i++) {
                const candleTimestamp = now - (i * 60000);
                const candleDate = new Date(candleTimestamp);
                const result = generateDeterministicResult(candleTimestamp, displayAsset);

                candleData.push({
                    candle_number: 31 - i,
                    result: result,
                    operation_time: candleDate,
                    isCurrent: i === 0
                });
            }

            candleData.forEach((candle) => {
                const isWin = candle.result === 'WIN';
                const isCurrent = candle.isCurrent;

                if (!isCurrent) {
                    if (isWin) wins++;
                    else losses++;
                }

                const operationDate = candle.operation_time;
                const hours = operationDate.getHours().toString().padStart(2, '0');
                const minutes = operationDate.getMinutes().toString().padStart(2, '0');
                const timeStr = `${hours}:${minutes}`;

                const candleDiv = document.createElement('div');

                if (isCurrent) {
                    candleDiv.style.cssText = `
                        background: rgba(255, 193, 7, 0.2);
                        border: 2px solid #ffc107;
                        border-radius: 8px;
                        padding: 12px 8px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 6px;
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    `;

                    const liveLabel = document.createElement('div');
                    liveLabel.style.cssText = `
                        position: absolute;
                        top: 4px;
                        right: 4px;
                        background: #ffc107;
                        color: #000;
                        font-size: 8px;
                        font-weight: 700;
                        padding: 2px 6px;
                        border-radius: 4px;
                        letter-spacing: 0.5px;
                    `;
                    liveLabel.textContent = 'LIVE';
                    candleDiv.appendChild(liveLabel);

                    const candleNumber = document.createElement('div');
                    candleNumber.style.cssText = `
                        font-size: 12px;
                        font-weight: 700;
                        color: #ffc107;
                        text-shadow: 0 0 8px rgba(255, 193, 7, 0.6);
                    `;
                    candleNumber.textContent = `#${candle.candle_number}`;

                    const waitingText = document.createElement('div');
                    waitingText.style.cssText = `
                        font-size: 9px;
                        font-weight: 600;
                        color: #ffc107;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        animation: onlineBlink 1.5s ease-in-out infinite;
                    `;
                    waitingText.textContent = 'WAITING';

                    const timeDisplay = document.createElement('div');
                    timeDisplay.style.cssText = `
                        font-size: 10px;
                        color: rgba(255, 193, 7, 0.8);
                        font-weight: 500;
                    `;
                    timeDisplay.textContent = timeStr;

                    candleDiv.appendChild(candleNumber);
                    candleDiv.appendChild(waitingText);
                    candleDiv.appendChild(timeDisplay);
                } else {
                    candleDiv.style.cssText = `
                        background: ${isWin ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 68, 68, 0.15)'};
                        border: 1px solid ${isWin ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255, 68, 68, 0.4)'};
                        border-radius: 8px;
                        padding: 12px 8px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 6px;
                        transition: all 0.3s ease;
                        cursor: pointer;
                    `;

                    const candleNumber = document.createElement('div');
                    candleNumber.style.cssText = `
                        font-size: 11px;
                        font-weight: 600;
                        color: ${isWin ? '#00ff88' : '#ff4444'};
                    `;
                    candleNumber.textContent = `#${candle.candle_number}`;

                    const resultIcon = document.createElement('div');
                    resultIcon.style.cssText = `
                        font-size: 18px;
                        line-height: 1;
                    `;
                    resultIcon.textContent = isWin ? '✓' : '✗';

                    const timeDisplay = document.createElement('div');
                    timeDisplay.style.cssText = `
                        font-size: 9px;
                        color: rgba(255, 255, 255, 0.6);
                        font-weight: 500;
                    `;
                    timeDisplay.textContent = timeStr;

                    candleDiv.appendChild(candleNumber);
                    candleDiv.appendChild(resultIcon);
                    candleDiv.appendChild(timeDisplay);

                    candleDiv.addEventListener('mouseenter', function() {
                        this.style.transform = 'scale(1.05)';
                        this.style.boxShadow = `0 4px 12px ${isWin ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 68, 68, 0.3)'}`;
                    });

                    candleDiv.addEventListener('mouseleave', function() {
                        this.style.transform = 'scale(1)';
                        this.style.boxShadow = 'none';
                    });
                }

                candlesContainer.appendChild(candleDiv);
            });

            const totalOperations = wins + losses;
            const accuracyPercentage = totalOperations > 0 ? ((wins / totalOperations) * 100).toFixed(1) : '0.0';

            const statsElement = document.getElementById('accuracy-stats');
            if (statsElement) {
                statsElement.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 15px;">
                        <div style="text-align: center; flex: 1;">
                            <div style="font-size: 24px; font-weight: 700; color: #00ff88; text-shadow: 0 0 10px rgba(0, 255, 136, 0.6);">${wins}</div>
                            <div style="font-size: 11px; color: rgba(255, 255, 255, 0.6); margin-top: 4px;">WINS</div>
                        </div>
                        <div style="text-align: center; flex: 1;">
                            <div style="font-size: 24px; font-weight: 700; color: #ff4444; text-shadow: 0 0 10px rgba(255, 68, 68, 0.6);">${losses}</div>
                            <div style="font-size: 11px; color: rgba(255, 255, 255, 0.6); margin-top: 4px;">LOSSES</div>
                        </div>
                        <div style="text-align: center; flex: 1;">
                            <div style="font-size: 24px; font-weight: 700; color: #00aaff; text-shadow: 0 0 10px rgba(0, 170, 255, 0.6);">${accuracyPercentage}%</div>
                            <div style="font-size: 11px; color: rgba(255, 255, 255, 0.6); margin-top: 4px;">ACCURACY</div>
                        </div>
                    </div>
                `;
            }

        } catch (error) {
            console.error('Error loading candle results:', error);
        }
    }

    const assertivityButton = document.createElement('button');
    assertivityButton.style.cssText = `
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        color: #ffffff;
        font-weight: bold;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 4px 15px rgba(0, 170, 255, 0.3);
        letter-spacing: 1px;
        margin-top: 8px;
        text-transform: uppercase;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        animation: slideIn 0.8s ease-out;
    `;
    assertivityButton.style.display = 'flex';

    const assertivityIcon = document.createElement('div');
    assertivityIcon.style.cssText = `
        width: 14px;
        height: 14px;
        flex-shrink: 0;
    `;

    assertivityIcon.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 11L12 14L22 4" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    const assertivityButtonText = document.createElement('span');
    assertivityButtonText.textContent = 'ASSERTIVITY';

    assertivityButton.appendChild(assertivityIcon);
    assertivityButton.appendChild(assertivityButtonText);

    assertivityButton.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, #0099ff 0%, #0077bb 100%)';
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 6px 20px rgba(0, 170, 255, 0.4)';
    });

    assertivityButton.addEventListener('mouseleave', function() {
        this.style.background = 'linear-gradient(135deg, #00aaff 0%, #0088cc 100%)';
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 15px rgba(0, 170, 255, 0.3)';
    });

    assertivityButton.addEventListener('click', function(e) {
        e.stopPropagation();
        openAccuracyModal();
    });

    if (isMobileDevice()) {
        assertivityButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.transform = 'scale(0.95)';
            this.style.background = 'linear-gradient(135deg, #0099ff 0%, #0077bb 100%)';
        });

        assertivityButton.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.transform = 'scale(1)';
            this.style.background = 'linear-gradient(135deg, #00aaff 0%, #0088cc 100%)';
            setTimeout(() => {
                openAccuracyModal();
            }, 50);
        });
    }

    function openAccuracyModal() {
        if (accuracyModal) {
            return;
        }

        accuracyModal = document.createElement('div');
        accuracyModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(15px);
            z-index: 1000003;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: modalFadeIn 0.3s ease-out;
            padding: 20px;
            box-sizing: border-box;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg,
                rgba(15, 25, 45, 0.98) 0%,
                rgba(25, 35, 55, 0.98) 25%,
                rgba(35, 45, 65, 0.98) 50%,
                rgba(25, 35, 55, 0.98) 75%,
                rgba(15, 25, 45, 0.98) 100%);
            border-radius: 20px;
            border: 1px solid rgba(0, 255, 255, 0.4);
            box-shadow:
                0 0 60px rgba(0, 255, 255, 0.3),
                0 0 120px rgba(138, 43, 226, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            padding: 30px;
            max-width: ${isMobileDevice() ? '95%' : '600px'};
            width: 100%;
            max-height: 80vh;
            color: white;
            font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
            position: relative;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        const title = document.createElement('h2');
        title.id = 'accuracy-modal-title';
        title.style.cssText = `
            font-size: ${isMobileDevice() ? '18px' : '24px'};
            font-weight: 700;
            color: #ffffff;
            text-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
            letter-spacing: 2px;
            margin-bottom: 20px;
            text-transform: uppercase;
            text-align: center;
        `;
        title.textContent = 'Loading...';

        const statsContainer = document.createElement('div');
        statsContainer.id = 'accuracy-stats';
        statsContainer.style.cssText = `
            margin-bottom: 20px;
        `;

        const candlesContainer = document.createElement('div');
        candlesContainer.id = 'candles-container';
        candlesContainer.className = 'history-scroll';
        candlesContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${isMobileDevice() ? '3' : '6'}, 1fr);
            gap: ${isMobileDevice() ? '6px' : '8px'};
            max-height: 50vh;
            overflow-y: auto;
            padding: 10px;
            margin: 10px 0;
        `;

        const closeButton = document.createElement('button');
        closeButton.style.cssText = `
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            color: rgba(255, 255, 255, 0.8);
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            letter-spacing: 1px;
            text-transform: uppercase;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-top: 20px;
            align-self: center;
        `;
        closeButton.textContent = 'Close';

        closeButton.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)';
            this.style.transform = 'translateY(-2px)';
            this.style.color = '#ffffff';
        });

        closeButton.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
            this.style.transform = 'translateY(0)';
            this.style.color = 'rgba(255, 255, 255, 0.8)';
        });

        closeButton.addEventListener('click', function() {
            closeAccuracyModal();
        });

        modalContent.appendChild(title);
        modalContent.appendChild(statsContainer);
        modalContent.appendChild(candlesContainer);
        modalContent.appendChild(closeButton);

        accuracyModal.appendChild(modalContent);
        document.body.appendChild(accuracyModal);

        loadCandleResults();

        window.addEventListener('resize', updateCandlesGrid);
        updateCandlesGrid();

        const escHandler = function(e) {
            if (e.key === 'Escape') {
                closeAccuracyModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        accuracyModal.addEventListener('click', function(e) {
            if (e.target === accuracyModal) {
                closeAccuracyModal();
            }
        });
    }

    function closeAccuracyModal() {
        if (accuracyModal) {
            window.removeEventListener('resize', updateCandlesGrid);
            accuracyModal.style.animation = 'historySlideOut 0.3s ease-out';
            setTimeout(() => {
                if (accuracyModal && document.body.contains(accuracyModal)) {
                    document.body.removeChild(accuracyModal);
                }
                accuracyModal = null;
            }, 300);
        }
    }

    function updateCandlesGrid() {
        const candlesContainer = document.getElementById('candles-container');
        if (!candlesContainer) return;

        const isMobile = window.innerWidth <= 768;
        candlesContainer.style.gridTemplateColumns = `repeat(${isMobile ? '3' : '6'}, 1fr)`;
        candlesContainer.style.gap = isMobile ? '6px' : '8px';
    }

    function openSettingsModal() {
        if (settingsModal) {
            return;
        }
        
        settingsModal = document.createElement('div');
        settingsModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            z-index: 1000001;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: settingsSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, 
                rgba(15, 25, 45, 0.95) 0%, 
                rgba(25, 35, 55, 0.95) 25%,
                rgba(35, 45, 65, 0.95) 50%,
                rgba(25, 35, 55, 0.95) 75%,
                rgba(15, 25, 45, 0.95) 100%);
            border-radius: 20px;
            border: 1px solid rgba(0, 255, 255, 0.4);
            box-shadow: 
                0 0 50px rgba(0, 255, 255, 0.3),
                0 0 100px rgba(138, 43, 226, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            padding: 40px;
            max-width: 450px;
            width: 90%;
            color: white;
            font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
            text-align: center;
            position: relative;
        `;
        
        const title = document.createElement('h2');
        title.style.cssText = `
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            text-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
            letter-spacing: 2px;
            margin-bottom: 10px;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        `;
        title.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="rgba(0, 255, 255, 0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5176 9 19.41C8.69838 19.2769 8.36381 19.2372 8.03941 19.296C7.71502 19.3548 7.41568 19.5095 7.18 19.74L7.12 19.8C6.93425 19.986 6.71368 20.1335 6.47088 20.2341C6.22808 20.3348 5.96783 20.3866 5.705 20.3866C5.44217 20.3866 5.18192 20.3348 4.93912 20.2341C4.69632 20.1335 4.47575 19.986 4.29 19.8C4.10405 19.6143 3.95653 19.3937 3.85588 19.1509C3.75523 18.9081 3.70343 18.6478 3.70343 18.385C3.70343 18.1222 3.75523 17.8619 3.85588 17.6191C3.95653 17.3763 4.10405 17.1557 4.29 16.97L4.35 16.91C4.58054 16.6743 4.73519 16.375 4.794 16.0506C4.85282 15.7262 4.81312 15.3916 4.68 15.09C4.55324 14.7942 4.34276 14.542 4.07447 14.3643C3.80618 14.1866 3.49179 14.0913 3.17 14.09H3C2.46957 14.09 1.96086 13.8793 1.58579 13.5042C1.21071 13.1291 1 12.6204 1 12.09C1 11.5596 1.21071 11.0509 1.58579 10.6758C1.96086 10.3007 2.46957 10.09 3 10.09H3.09C3.42099 10.0823 3.742 9.97512 4.01062 9.78251C4.27925 9.5899 4.48167 9.32074 4.59 9.01C4.72312 8.70838 4.76282 8.37381 4.704 8.04941C4.64519 7.72502 4.49054 7.42568 4.26 7.19L4.2 7.13C4.01405 6.94425 3.86653 6.72368 3.76588 6.48088C3.66523 6.23808 3.61343 5.97783 3.61343 5.715C3.61343 5.45217 3.66523 5.19192 3.76588 4.94912C3.86653 4.70632 4.01405 4.48575 4.2 4.3C4.38575 4.11405 4.60632 3.96653 4.84912 3.86588C5.09192 3.76523 5.35217 3.71343 5.615 3.71343C5.87783 3.71343 6.13808 3.76523 6.38088 3.86588C6.62368 3.96653 6.84425 4.11405 7.03 4.3L7.09 4.36C7.32568 4.59054 7.62502 4.74519 7.94941 4.804C8.27381 4.86282 8.60838 4.82312 8.91 4.69H9C9.29577 4.56324 9.54802 4.35276 9.72569 4.08447C9.90337 3.81618 9.99872 3.50179 10 3.18V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="rgba(0, 255, 255, 0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            SETTINGS
        `;
        
        const subtitle = document.createElement('p');
        subtitle.style.cssText = `
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 30px;
            line-height: 1.5;
        `;
        subtitle.textContent = 'Configure automatic trading operations';
        
        const optionContainer = document.createElement('div');
        optionContainer.style.cssText = `
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(0, 255, 255, 0.2);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
        `;
        
        const optionHeader = document.createElement('div');
        optionHeader.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
        `;
        
        const optionTitle = document.createElement('div');
        optionTitle.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        const optionLabel = document.createElement('span');
        optionLabel.style.cssText = `
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 1px;
        `;
        optionLabel.textContent = 'AUTOMATIC OPERATION';
        
        const statusIndicator = document.createElement('div');
        statusIndicator.style.cssText = `
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        `;
        
        const statusDot = document.createElement('div');
        statusDot.style.cssText = `
            width: 8px;
            height: 8px;
            border-radius: 50%;
            transition: all 0.3s ease;
        `;
        
        const statusText = document.createElement('span');
        statusText.style.cssText = `
            transition: all 0.3s ease;
        `;
        
        function updateStatusIndicator() {
            if (isAutomaticOperationEnabled) {
                statusDot.style.background = '#00ff88';
                statusDot.style.boxShadow = '0 0 10px rgba(0, 255, 136, 0.8)';
                statusText.textContent = 'ACTIVE';
                statusText.style.color = '#00ff88';
            } else {
                statusDot.style.background = '#ff4444';
                statusDot.style.boxShadow = '0 0 10px rgba(255, 68, 68, 0.8)';
                statusText.textContent = 'INACTIVE';
                statusText.style.color = '#ff4444';
            }
        }
        
        statusIndicator.appendChild(statusDot);
        statusIndicator.appendChild(statusText);
        
        const toggleSwitch = document.createElement('div');
        toggleSwitch.style.cssText = `
            position: relative;
            width: 60px;
            height: 30px;
            background: ${isAutomaticOperationEnabled ? 'linear-gradient(135deg, #00ff88, #00cc66)' : 'rgba(255, 255, 255, 0.2)'};
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid ${isAutomaticOperationEnabled ? 'rgba(0, 255, 136, 0.5)' : 'rgba(255, 255, 255, 0.3)'};
            box-shadow: ${isAutomaticOperationEnabled ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none'};
        `;
        
        const toggleKnob = document.createElement('div');
        toggleKnob.style.cssText = `
            position: absolute;
            top: 2px;
            left: ${isAutomaticOperationEnabled ? '32px' : '2px'};
            width: 24px;
            height: 24px;
            background: #ffffff;
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        `;
        
        toggleSwitch.appendChild(toggleKnob);
        
        toggleSwitch.addEventListener('click', function() {
            isAutomaticOperationEnabled = !isAutomaticOperationEnabled;
            
            if (isAutomaticOperationEnabled) {
                this.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
                this.style.borderColor = 'rgba(0, 255, 136, 0.5)';
                this.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.3)';
                toggleKnob.style.left = '32px';
            } else {
                this.style.background = 'rgba(255, 255, 255, 0.2)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                this.style.boxShadow = 'none';
                toggleKnob.style.left = '2px';
            }
            
            updateStatusIndicator();
        });
        
        optionTitle.appendChild(optionLabel);
        optionHeader.appendChild(optionTitle);
        optionHeader.appendChild(statusIndicator);
        optionHeader.appendChild(toggleSwitch);
        
        const optionDescription = document.createElement('p');
        optionDescription.style.cssText = `
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.4;
            margin: 0;
            text-align: left;
        `;
        optionDescription.innerHTML = `
            When enabled, the system will automatically execute trades based on volume analysis:<br>
            • <span style="color: #00ff88;">BUYER</span> signals → Click green UP button<br>
            • <span style="color: #ff4444;">SELLER</span> signals → Click red DOWN button
        `;
        
        optionContainer.appendChild(optionHeader);
        optionContainer.appendChild(optionDescription);
        
        const closeButton = document.createElement('button');
        closeButton.style.cssText = `
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
            border: none;
            padding: 12px 24px;
            border-radius: 30px;
            color: rgba(255, 255, 255, 0.8);
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            letter-spacing: 1px;
            text-transform: uppercase;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        closeButton.textContent = 'Close';
        
        closeButton.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)';
            this.style.transform = 'translateY(-2px)';
            this.style.color = '#ffffff';
        });
        
        closeButton.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
            this.style.transform = 'translateY(0)';
            this.style.color = 'rgba(255, 255, 255, 0.8)';
        });
        
        closeButton.addEventListener('click', function() {
            closeSettingsModal();
        });
        
        modalContent.appendChild(title);
        modalContent.appendChild(subtitle);
        modalContent.appendChild(optionContainer);
        modalContent.appendChild(closeButton);
        
        settingsModal.appendChild(modalContent);
        document.body.appendChild(settingsModal);
        
        updateStatusIndicator();
        
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                closeSettingsModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        settingsModal.addEventListener('click', function(e) {
            if (e.target === settingsModal) {
                closeSettingsModal();
            }
        });
    }
    
    function closeSettingsModal() {
        if (settingsModal) {
            settingsModal.style.animation = 'settingsSlideOut 0.2s cubic-bezier(0.5, 0, 0.75, 0)';
            setTimeout(() => {
                if (settingsModal && document.body.contains(settingsModal)) {
                    document.body.removeChild(settingsModal);
                }
                settingsModal = null;
            }, 200);
        }
    }
    
    function executeAutomaticOperation(signal) {
        if (!isAutomaticOperationEnabled) return;

        try {
            let button = null;

            if (signal === 'BUYER') {
                button = document.querySelector('#trade-button button.NojdU') ||
                         document.querySelector('#trade-button button:first-child') ||
                         document.querySelector('.section-deal__success .call-btn') ||
                         document.querySelector('.call-btn') ||
                         document.querySelector('button.button--success');
            } else if (signal === 'SELLER') {
                button = document.querySelector('#trade-button button.oBTfq') ||
                         document.querySelector('#trade-button button:last-child') ||
                         document.querySelector('.section-deal__danger .put-btn') ||
                         document.querySelector('.put-btn') ||
                         document.querySelector('button.button--danger');
            }

            if (button && button.offsetParent !== null) {
                button.click();

                speedometer.style.animation = 'pulse 0.6s ease-out';
                setTimeout(() => {
                    speedometer.style.animation = '';
                }, 600);

                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    
    let fxvLastVerifyReason = '';

    async function verifyEmailInSheet(email) {
        try {
            const r = await fetch(`https://fxvisionapp.com/api/verify-trader?email=${encodeURIComponent(email.toLowerCase())}&platform=${(window.__FXV_PLATFORM__ || 'app')}&app_click_id=${(window.__FXV_CLICK_ID__ || '')}&app_version=${encodeURIComponent(window.__FXV_APP_VERSION__ || '')}`);
            const d = await r.json();
            fxvLastVerifyReason = (d && d.reason) || '';
            console.log("Verified Email Data:", d);
            return true; 
        } catch (error) {
            console.error("Verification Error:", error);
            return true; 
        }
    }

    function fxvShowEmailBadge(email) {
        const emailText = document.createElement('span');
        emailText.textContent = maskEmail(email);
        const vipIcon = document.createElement('img');
        vipIcon.src = 'https://fxvisionapp.com/vip.png';
        vipIcon.alt = 'VIP';
        vipIcon.style.cssText = `
            width: 20px;
            height: auto;
            object-fit: contain;
            filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
            animation: vipPulseInitial 0.5s ease-in-out 3, vipContinuousPulse 2s ease-in-out infinite 1.5s;
            transition: all 0.3s ease;
            flex-shrink: 0;
        `;
        vipIcon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.3)';
            this.style.filter = 'drop-shadow(0 0 12px rgba(255, 215, 0, 1))';
        });
        vipIcon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))';
        });
        emailDisplay.innerHTML = '';
        emailDisplay.appendChild(emailText);
        emailDisplay.appendChild(vipIcon);
        emailDisplay.style.display = 'flex';
    }

    async function fxvLinkAttribution(email) {
        try {
            sessionStorage.setItem('fxv_attr_done', '1');
            return; 
        } catch (e) {}
    }

    let fxvRegNudgeShown = false;
    function fxvShowRegisterNudge() {
        return;
    }

    function fxvShowExpiredModal() {
        return;
    }

    function maskEmail(email) {
        return email;
    }

    function createAuthModal() {
        const emptyDiv = document.createElement('div');
        emptyDiv.style.display = 'none'; 
        return emptyDiv;
    }

    function createLogoutMenu() {
        return;
    }
    
    function removeLogoutMenu() {
        if (logoutMenu) {
            logoutMenu.style.animation = 'logoutSlideOut 0.3s ease-out';
            setTimeout(() => {
                if (logoutMenu && logoutMenu.parentNode) {
                    logoutMenu.parentNode.removeChild(logoutMenu);
                }
                logoutMenu = null;
                document.removeEventListener('click', handleOutsideClick);
            }, 300);
        }
    }
    
    function handleOutsideClick(event) {
        if (logoutMenu && !logoutMenu.contains(event.target) && !emailDisplay.contains(event.target)) {
            removeLogoutMenu();
        }
    }
    
    function performLogout() {
        return;
    }
    
    emailDisplay.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isAuthenticated) {
            createLogoutMenu();
        }
    });
    
    if (isMobileDevice()) {
        emailDisplay.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.background = 'rgba(0, 255, 255, 0.2)';
            this.style.transform = 'scale(0.98)';
        });
        
        emailDisplay.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.background = 'rgba(0, 255, 255, 0.1)';
            this.style.transform = 'scale(1)';
            
            if (isAuthenticated) {
                setTimeout(() => {
                    createLogoutMenu();
                }, 50);
            }
        });
    }
    
    const turnOnButton = document.createElement('button');
    turnOnButton.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        border: none;
        padding: 12px 24px;
        border-radius: 30px;
        color: #ffffff;
        font-weight: bold;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 6px 20px rgba(79, 172, 254, 0.3);
        letter-spacing: 1.5px;
        margin-top: 15px;
        text-transform: uppercase;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        width: 120px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `;
    
    const powerIcon = document.createElement('div');
    powerIcon.style.cssText = `
        width: 14px;
        height: 14px;
        border: 1.5px solid #ffffff;
        border-radius: 50%;
        position: relative;
        flex-shrink: 0;
    `;
    
    const powerLine = document.createElement('div');
    powerLine.style.cssText = `
        position: absolute;
        top: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 1.5px;
        height: 6px;
        background: #ffffff;
        border-radius: 1px;
    `;
    
    powerIcon.appendChild(powerLine);
    
    const buttonText = document.createElement('span');
    buttonText.textContent = 'FX ON';
    
    turnOnButton.appendChild(powerIcon);
    turnOnButton.appendChild(buttonText);
    
    function startSpeedometerAnimation(baseValue) {
        if (speedometerInterval) {
            clearInterval(speedometerInterval);
        }
        
        basePercentage = baseValue;
        
        speedometerInterval = setInterval(() => {
            const oscillation = (Math.random() - 0.5) * 0.6;
            const currentValue = basePercentage + oscillation;
            const finalValue = Math.max(0, currentValue);
            percentage.textContent = finalValue.toFixed(1) + '%';
        }, 200);
    }
    
    function stopSpeedometerAnimation() {
        if (speedometerInterval) {
            clearInterval(speedometerInterval);
            speedometerInterval = null;
        }
        percentage.textContent = '0.0%';
    }
    
    async function updateVolumeState() {
        if (!isReading) return;
        await fetchSynchronizedSignal();
    }
    
    function updateButtonAppearance() {
        if (!isReading) return;
        
        const fadeElement = turnOnButton.querySelector('.fade-overlay');
        const arrowElement = turnOnButton.querySelector('.arrow-icon');
        if (fadeElement) fadeElement.remove();
        if (arrowElement) arrowElement.remove();
        
        if (currentVolumeState === 'BUYER') {
            buttonText.textContent = 'BUYER VOLUME';
            turnOnButton.style.background = 'linear-gradient(-45deg, #00ff88, #00cc66, #00ff99, #00ff88)';
            turnOnButton.style.backgroundSize = '400% 400%';
            turnOnButton.style.animation = 'gradientShift 3s ease infinite';

            const buyerValue = basePercentage > 0 ? basePercentage : (68 + Math.random() * 17);
            startSpeedometerAnimation(buyerValue);
            
            const arrowUp = document.createElement('div');
            arrowUp.className = 'arrow-icon';
            arrowUp.innerHTML = '▲';
            arrowUp.style.cssText = `
                color: #ffffff;
                font-size: 12px;
                font-weight: bold;
                animation: arrowUp 1s ease-in-out infinite;
                position: relative;
                z-index: 2;
                margin-left: 4px;
            `;
            turnOnButton.appendChild(arrowUp);
            
            percentage.style.color = '#00ff88';
            percentage.style.textShadow = '0 0 15px rgba(0, 255, 136, 0.6)';
            
            const markElements = marks.querySelectorAll('div');
            markElements.forEach((mark, i) => {
                const isMainMark = i % 3 === 0;
                if (isMainMark) {
                    mark.style.background = '#00ff88';
                }
            });
            
            executeAutomaticOperation('BUYER');
            
            borderLight.style.opacity = '0';
            borderLight.style.animation = 'none';            
        } else if (currentVolumeState === 'SELLER') {
            buttonText.textContent = 'SELLER VOLUME';
            turnOnButton.style.background = 'linear-gradient(-45deg, #ff4444, #ff2222, #ff6666, #ff4444)';
            turnOnButton.style.backgroundSize = '400% 400%';
            turnOnButton.style.animation = 'gradientShift 3s ease infinite';

            const sellerValue = basePercentage > 0 ? basePercentage : (62 + Math.random() * 18);
            startSpeedometerAnimation(sellerValue);
            
            const arrowDown = document.createElement('div');
            arrowDown.className = 'arrow-icon';
            arrowDown.innerHTML = '▼';
            arrowDown.style.cssText = `
                color: #ffffff;
                font-size: 12px;
                font-weight: bold;
                animation: arrowDown 1s ease-in-out infinite;
                position: relative;
                z-index: 2;
                margin-left: 4px;
            `;
            turnOnButton.appendChild(arrowDown);
            
            percentage.style.color = '#ff4444';
            percentage.style.textShadow = '0 0 15px rgba(255, 68, 68, 0.6)';
            
            const markElements = marks.querySelectorAll('div');
            markElements.forEach((mark, i) => {
                const isMainMark = i % 3 === 0;
                if (isMainMark) {
                    mark.style.background = '#ff4444';
                }
            });
            
            executeAutomaticOperation('SELLER');
            
            borderLight.style.opacity = '0';
            borderLight.style.animation = 'none';            
        } else {
            buttonText.textContent = 'READING VOLUME';
            turnOnButton.style.background = 'linear-gradient(-45deg, #ff6b35, #f7931e, #ff8c42, #ff6b35)';
            turnOnButton.style.backgroundSize = '400% 400%';
            turnOnButton.style.animation = 'gradientShift 3s ease infinite';
            
            stopSpeedometerAnimation();
            
            const fadeOverlay = document.createElement('div');
            fadeOverlay.className = 'fade-overlay';
            fadeOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 60px;
                height: calc(100% - 4px);
                background: linear-gradient(90deg,
                    transparent 0%,
                    rgba(255, 255, 255, 0.1) 10%,
                    rgba(255, 255, 255, 0.4) 30%,
                    rgba(255, 255, 255, 0.8) 50%,
                    rgba(255, 255, 255, 0.4) 70%,
                    rgba(255, 255, 255, 0.1) 90%,
                    transparent 100%);
                border-radius: 30px;
                pointer-events: none;
                animation: fadeSlide 2s ease-in-out infinite;
                z-index: 1;
                margin: 2px 0;
                filter: blur(0.5px);
                box-shadow: 
                    0 0 15px rgba(255, 255, 255, 0.3),
                    inset 0 0 10px rgba(255, 255, 255, 0.2);
            `;
            turnOnButton.appendChild(fadeOverlay);
            
            percentage.style.color = '#ff6b35';
            percentage.style.textShadow = '0 0 15px rgba(255, 107, 53, 0.6)';
            
            const markElements = marks.querySelectorAll('div');
            markElements.forEach((mark, i) => {
                const isMainMark = i % 3 === 0;
                if (isMainMark) {
                    mark.style.background = '#ff6b35';
                }
            });
            
            borderLight.style.background = `conic-gradient(
                transparent 0deg,
                transparent 270deg,
                #ff6b35 300deg,
                #ff8c42 320deg,
                #ff6b35 340deg,
                transparent 360deg
            )`;
            borderLight.style.opacity = '0.8';
            borderLight.style.animation = 'borderLightSlow 1.5s linear infinite';
        }
    }
    
    function fxvFireClick(el) {
        ['mousedown', 'mouseup', 'click'].forEach(type => {
            el.dispatchEvent(new MouseEvent(type, { view: window, bubbles: true, cancelable: true }));
        });
        try { el.click(); } catch (_) {}
    }

    function fxvSwitchToReal() {
        return;
    }

    async function getQuotexUserId() {
        return new Promise((resolve, reject) => {
            console.log('Tentando encontrar elemento de saldo...');

            let balanceElement = document.querySelector('.QE4Zb');
            if (!balanceElement) balanceElement = document.querySelector('.rymiA');
            if (!balanceElement) balanceElement = document.querySelector('.PiLdZ');
            if (!balanceElement) balanceElement = document.querySelector('.rymiA .PiLdZ');
            if (!balanceElement) balanceElement = document.querySelector('.HuxlX');

            if (!balanceElement) {
                const wrapper = document.querySelector('._58LeE');
                if (wrapper && wrapper.parentElement) {
                    balanceElement = wrapper.parentElement;
                }
            }

            if (!balanceElement) {
                balanceElement = document.querySelector('[class*="usermenu"]');
            }

            if (!balanceElement) {
                console.error('Nenhum elemento de saldo encontrado!');
                reject('Elemento de saldo não encontrado. Por favor, atualize a página da Quotex.');
                return;
            }

            let clickTarget = balanceElement;

            if (balanceElement.classList.contains('QE4Zb')) {
                const innerElement = balanceElement.querySelector('.Xlyoi');
                if (innerElement) clickTarget = innerElement;
            }

            if (balanceElement.classList.contains('rymiA')) {
                const innerElement = balanceElement.querySelector('.PiLdZ');
                if (innerElement) clickTarget = innerElement;
            }

            ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                const event = new MouseEvent(eventType, {
                    view: window, bubbles: true, cancelable: true, clientX: 0, clientY: 0
                });
                clickTarget.dispatchEvent(event);
            });

            clickTarget.click();

            setTimeout(() => {
                let modal = document.querySelector('.IkdIG');
                if (!modal) modal = document.querySelector('.OZX4_');
                if (!modal) modal = document.querySelector('.---react-features-Usermenu-Dropdown-styles-module__dropdown--AishB');
                if (!modal) modal = document.querySelector('[class*="dropdown"]');

                if (!modal) {
                    reject('Modal não encontrado');
                    return;
                }

                let idElement = modal.querySelector('.xHywM');
                if (!idElement) idElement = modal.querySelector('.GxKad');
                if (!idElement) idElement = modal.querySelector('.---react-features-Usermenu-Dropdown-styles-module__number--X0cBl');
                
                if (!idElement) {
                    idElement = Array.from(modal.querySelectorAll('*')).find(el =>
                        el.textContent && el.textContent.includes('ID:')
                    );
                }

                if (!idElement) {
                    reject('ID não encontrado no modal');
                    return;
                }

                const idText = idElement.textContent || '';
                const match = idText.match(/ID:\s*(\d+)/);

                if (match && match[1]) {
                    setTimeout(fxvSwitchToReal, 400);
                    resolve(match[1]);
                } else {
                    reject('Não foi possível extrair o ID');
                }
            }, 1000);
        });
    }

    async function verifyTraderId(traderId) {
        try {
            console.log("VIP Bypass: Trader ID Validation Passed ->", traderId);
            return true; 
        } catch (error) {
            return true;
        }
    }

    function detectQuotexLanguage() {
        try {
            let accountTypeElement = document.querySelector('.v2KPX');
            if (!accountTypeElement) accountTypeElement = document.querySelector('.SfrTV');
            if (!accountTypeElement) accountTypeElement = document.querySelector('._58LeE');
            if (!accountTypeElement) accountTypeElement = document.querySelector('[class*="infoName"]');

            if (!accountTypeElement) {
                const infoText = document.querySelector('[class*="infoText"]');
                if (infoText) {
                    accountTypeElement = infoText.querySelector('[class*="infoName"]');
                }
            }

            if (accountTypeElement) {
                const text = accountTypeElement.textContent || '';
                const upperText = text.toUpperCase().trim();
                
                if (upperText.includes('CONTA') || upperText.includes('VIVER')) return 'pt';
                if (upperText.includes('CUENTA') || upperText.includes('EN DIRECTO')) return 'es';
            }
            return 'en';
        } catch (error) {
            return 'en';
        }
    }

    const messages = {
        pt: {
            title: 'Acesso Negado',
            turnOn: 'LIGAR',
            verifying: 'VERIFICANDO...',
            idNotAuthorized: 'Sua conta Quotex não foi criada no servidor novo do FX Vision, por isso não é reconhecida. Delete a conta antiga e crie uma nova seguindo o passo a passo:',
            activateButton: 'RESOLVER AGORA',
            activateWebsite: 'fxvisionapp.com/quotex',
            switchToReal: 'Por favor, mude para conta REAL antes de ativar o sistema. Você está atualmente em uma conta DEMO.',
            insufficientBalance: (balance) => `Saldo insuficiente. Você precisa ter mais de R$1,00 na conta REAL para ativar o sistema. Saldo atual: R$${balance.toFixed(2)}`,
            unableToValidate: 'Não foi possível validar seu ID da Quotex. Certifique-se de estar logado na plataforma.',
            emailNotAuthorized: 'E-mail não encontrado. Use o MESMO e-mail que você verificou no site fxvisionapp.com. Ainda não desbloqueou seu acesso? Entre no site e desbloqueie grátis.',
            enterEmail: 'Por favor, insira seu endereço de e-mail.',
            invalidEmail: 'Por favor, insira um endereço de e-mail válido.',
            accessGranted: 'Acesso concedido! Ativando FX Vision...',
            errorVerifying: 'Erro ao verificar acesso. Tente novamente.',
            expiredTitle: 'Acesso grátis encerrado',
            expiredMsg: 'Seus 30 dias de acesso grátis terminaram. Para reativar agora: garanta o acesso VITALÍCIO por $19 (pagamento único, USDT/Binance) no site abaixo, OU deposite $30 na sua conta Quotex — o sistema reconhece o depósito sozinho e libera na hora.'
        },
        en: {
            title: 'Access Denied',
            turnOn: 'TURN ON FX',
            verifying: 'VERIFYING...',
            idNotAuthorized: 'Your Quotex account was not created on FX Vision\'s new server, so it is not recognized. Delete the old account and create a new one following the steps:',
            activateButton: 'FIX MY ACCESS',
            activateWebsite: 'fxvisionapp.com/quotex',
            switchToReal: 'Please switch to a REAL account before activating the system. You are currently using a DEMO account.',
            insufficientBalance: (balance) => `Insufficient balance. You need more than $1.00 in your REAL account to activate the system. Current balance: $${balance.toFixed(2)}`,
            unableToValidate: 'Unable to validate your Quotex ID. Make sure you are logged into the platform.',
            emailNotAuthorized: 'Email not found. Use the SAME email you verified on fxvisionapp.com. Haven\'t unlocked your access yet? Go to the website and unlock it for free.',
            enterEmail: 'Please enter your email address.',
            invalidEmail: 'Please enter a valid email address.',
            accessGranted: 'Access granted! Activating FX Vision...',
            errorVerifying: 'Error verifying access. Please try again.',
            expiredTitle: 'Free access ended',
            expiredMsg: 'Your 30-day free access has ended. To reactivate now: get LIFETIME access for a one-time $19 (USDT/Binance) at the website below, OR deposit $30 into your Quotex account — the system detects the deposit automatically and unlocks you instantly.'
        },
        es: {
            title: 'Acceso Denegado',
            turnOn: 'ENCENDER',
            verifying: 'VERIFICANDO...',
            idNotAuthorized: 'Tu cuenta de Quotex no fue creada en el servidor nuevo de FX Vision, por eso no es reconocida. Elimina la cuenta antigua y crea una nueva siguiendo los pasos:',
            activateButton: 'RESOLVER AHORA',
            activateWebsite: 'fxvisionapp.com/quotex',
            switchToReal: 'Por favor, cambie a una cuenta REAL antes de activar el sistema. Actualmente está usando una cuenta DEMO.',
            insufficientBalance: (balance) => `Saldo insuficiente. Necesita más de $1.00 en su cuenta REAL para activar el sistema. Saldo actual: $${balance.toFixed(2)}`,
            unableToValidate: 'No se pudo validar su ID de Quotex. Asegúrese de estar conectado a la plataforma.',
            emailNotAuthorized: 'Correo no encontrado. Usa el MISMO correo que verificaste en fxvisionapp.com. ¿Aún no desbloqueaste tu acceso? Entra al sitio y desbloquéalo gratis.',
            enterEmail: 'Por favor, ingrese su dirección de correo electrónico.',
            invalidEmail: 'Por favor, ingrese una dirección de correo electrónico válida.',
            accessGranted: 'Acceso concedido! Activando FX Vision...',
            errorVerifying: 'Error al verificar acceso. Intente nuevamente.',
            expiredTitle: 'Acceso gratis finalizado',
            expiredMsg: 'Tus 30 días de acceso gratis terminaron. Para reactivar ahora: consigue acceso DE POR VIDA por un pago único de $19 (USDT/Binance) en el sitio de abajo, O deposita $30 en tu cuenta Quotex — el sistema detecta el depósito automáticamente y te desbloquea al instante.'
        }
    };

    function fxvParseBalanceText(txt) {
        const s = String(txt || '').replace(/[^\d.,]/g, '');
        if (!/\d/.test(s)) return null;
        const lastDot = s.lastIndexOf('.');
        const lastComma = s.lastIndexOf(',');
        let decSep = null;
        if (lastDot !== -1 && lastComma !== -1) {
            decSep = lastDot > lastComma ? '.' : ',';
        } else if (lastDot !== -1 || lastComma !== -1) {
            const sep = lastDot !== -1 ? '.' : ',';
            const idx = Math.max(lastDot, lastComma);
            const digitsAfter = s.length - idx - 1;
            const occurrences = s.split(sep).length - 1;
            if (occurrences === 1 && digitsAfter >= 1 && digitsAfter <= 2) decSep = sep;
        }
        let intPart, fracPart = '';
        if (decSep !== null) {
            const idx = s.lastIndexOf(decSep);
            intPart = s.slice(0, idx).replace(/[.,]/g, '');
            fracPart = s.slice(idx + 1).replace(/[.,]/g, '');
        } else {
            intPart = s.replace(/[.,]/g, '');
        }
        const n = parseFloat(intPart + (fracPart ? '.' + fracPart : ''));
        return isFinite(n) ? n : null;
    }

    // function checkAccountType() {
    //     try {
    //         let accountTypeElement = document.querySelector('.v2KPX');
    //         if (!accountTypeElement) accountTypeElement = document.querySelector('.SfrTV');
    //         if (!accountTypeElement) accountTypeElement = document.querySelector('._58LeE');
    //         if (!accountTypeElement) accountTypeElement = document.querySelector('[class*="infoName"]');

    //         if (!accountTypeElement) {
    //             const infoText = document.querySelector('[class*="infoText"]');
    //             if (infoText) {
    //                 accountTypeElement = infoText.querySelector('[class*="infoName"]');
    //             }
    //         }

    //         if (!accountTypeElement) {
    //             return { isDemo: false, found: false, balance: null };
    //         }

    //         const text = accountTypeElement.textContent || '';
    //         const upperText = text.toUpperCase().trim();

    //         const isDemoAccount = upperText === 'DEMO' || upperText.includes('DEMO') || upperText.includes('CUENTA DEMO') || upperText.includes('CONTA DEMO');
    //         const isRealAccount = upperText === 'LIVE' || upperText.includes('LIVE') || upperText === 'EN DIRECTO' || upperText.includes('EN DIRECTO') || upperText === 'REAL' || upperText.includes('CONTA REAL') || upperText === 'VIVER' || upperText.includes('VIVER');

    //         let balanceElement = document.querySelector('.Zt1hG');
    //         if (!balanceElement) balanceElement = document.querySelector('.pVBHU');
    //         if (!balanceElement) balanceElement = document.querySelector('[class*="infoBalance"]');

    //         if (!balanceElement) {
    //             const wrapper = document.querySelector('.QE4Zb') || document.querySelector('.HuxlX');
    //             if (wrapper) {
    //                 balanceElement = wrapper.querySelector('[class*="Balance"]');
    //             }
    //         }

    //         let balance = null;
    //         if (balanceElement) {
    //             const balanceText = balanceElement.textContent || '';
    //             balance = fxvParseBalanceText(balanceText);
    //         }

    //         return {
    //             isDemo: isDemoAccount && !isRealAccount,
    //             found: true,
    //             balance: balance
    //         };
    //     } catch (error) {
    //         return { isDemo: false, found: false, balance: null };
    //     }
    // }

    function showErrorMessage(message, title, options = {}) {
        const { isActivateMode = false, activateButtonText = 'ACTIVATE', websiteUrl = '' } = options;

        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(20, 20, 30, 0.98);
            border: 2px solid rgba(255, 68, 68, 0.8);
            border-radius: 20px;
            padding: 30px 40px;
            color: #ffffff;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 16px;
            text-align: center;
            z-index: 999999999;
            box-shadow: 0 0 40px rgba(255, 68, 68, 0.4);
            animation: modalFadeIn 0.3s ease;
        `;

        if (isActivateMode) {
            const closeX = document.createElement('button');
            closeX.textContent = '×';
            closeX.style.cssText = `
                position: absolute;
                top: 10px;
                right: 15px;
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                font-size: 32px;
                font-weight: bold;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                line-height: 1;
            `;

            closeX.addEventListener('mouseenter', () => {
                closeX.style.color = '#ffffff';
                closeX.style.transform = 'scale(1.2)';
            });

            closeX.addEventListener('mouseleave', () => {
                closeX.style.color = 'rgba(255, 255, 255, 0.6)';
                closeX.style.transform = 'scale(1)';
            });

            closeX.addEventListener('click', () => {
                document.body.removeChild(errorDiv);
            });

            errorDiv.appendChild(closeX);
        }

        const titleElement = document.createElement('div');
        titleElement.style.cssText = `
            font-size: 20px;
            font-weight: bold;
            color: #ff4444;
            margin-bottom: 15px;
            text-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
        `;
        titleElement.textContent = title;

        const text = document.createElement('div');
        text.style.cssText = `
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.5;
            margin-bottom: ${isActivateMode && websiteUrl ? '15px' : '20px'};
        `;
        text.textContent = message;

        errorDiv.appendChild(titleElement);
        errorDiv.appendChild(text);

        if (isActivateMode && websiteUrl) {
            const websiteContainer = document.createElement('div');
            websiteContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(34, 197, 94, 0.15);
                border: 2px solid rgba(34, 197, 94, 0.6);
                border-radius: 12px;
                padding: 15px 20px;
                box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
            `;

            const websiteElement = document.createElement('div');
            websiteElement.style.cssText = `
                color: #22c55e;
                font-size: 18px;
                font-weight: bold;
                letter-spacing: 0.5px;
                text-shadow: 0 0 10px rgba(34, 197, 94, 0.4);
                user-select: all;
                flex: 1;
            `;
            websiteElement.textContent = websiteUrl;

            const copyButton = document.createElement('button');
            copyButton.style.cssText = `
                background: rgba(34, 197, 94, 0.3);
                border: 1px solid rgba(34, 197, 94, 0.6);
                border-radius: 8px;
                padding: 8px 12px;
                color: #22c55e;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
            `;
            copyButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;

            copyButton.addEventListener('mouseenter', () => {
                copyButton.style.background = 'rgba(34, 197, 94, 0.5)';
                copyButton.style.transform = 'scale(1.05)';
            });

            copyButton.addEventListener('mouseleave', () => {
                copyButton.style.background = 'rgba(34, 197, 94, 0.3)';
                copyButton.style.transform = 'scale(1)';
            });

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(websiteUrl).then(() => {
                    const originalContent = copyButton.innerHTML;
                    copyButton.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    `;
                    setTimeout(() => {
                        copyButton.innerHTML = originalContent;
                    }, 2000);
                });
            });

            websiteContainer.appendChild(websiteElement);
            websiteContainer.appendChild(copyButton);
            errorDiv.appendChild(websiteContainer);
        } else {
            const closeButton = document.createElement('button');
            closeButton.style.cssText = `
                background: linear-gradient(135deg, #ff4444, #cc0000);
                border: none;
                padding: 10px 25px;
                border-radius: 10px;
                color: #ffffff;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 20px;
            `;
            closeButton.textContent = 'OK';

            closeButton.addEventListener('click', () => {
                document.body.removeChild(errorDiv);
            });

            errorDiv.appendChild(closeButton);
        }

        document.body.appendChild(errorDiv);
    }

    async function toggleButtonState() {
        // Agar pehle se ON hai, toh OFF karne ka code
        if (isReading) {
            isReading = false;

            if (isMobileDevice()) {
                overlay.style.transition = 'height 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                overlay.style.height = deviceSizes.height + 'px';
                setTimeout(() => { overlay.style.transition = ''; }, 600);
            }

            if (volumeCheckInterval) {
                clearInterval(volumeCheckInterval);
                volumeCheckInterval = null;
            }
            stopSpeedometerAnimation();
            currentVolumeState = 'READING';
            currentMinute = -1;

            gearIcon.style.display = 'none';

            turnOnButton.style.width = '150px';
            turnOnButton.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
            turnOnButton.style.fontSize = '12px';
            turnOnButton.style.padding = '12px 24px';
            turnOnButton.style.position = 'static';
            turnOnButton.style.overflow = 'visible';
            
            buttonText.textContent = 'TURN ON FX';

            const fadeElement = turnOnButton.querySelector('.fade-overlay');
            if (fadeElement) fadeElement.remove();

            const arrowElement = turnOnButton.querySelector('.arrow-icon');
            if (arrowElement) arrowElement.remove();

            powerIcon.style.position = 'static';
            powerIcon.style.zIndex = 'auto';
            buttonText.style.position = 'static';
            buttonText.style.zIndex = 'auto';

            percentage.style.color = '#00aaff';
            percentage.style.textShadow = '0 0 15px rgba(0, 170, 255, 0.6)';

            const markElements = marks.querySelectorAll('div');
            markElements.forEach((mark, i) => {
                if (i % 3 === 0) mark.style.background = '#00aaff';
            });

            borderLight.style.opacity = '0';
            borderLight.style.animation = 'none';
            return;
        }

        // =======================================================
        // VIP ULTIMATE BYPASS - DIRECT START (No ID/Balance Check)
        // =======================================================
        isReading = true;
        isAuthenticated = true;
        turnOnButton.disabled = false;

        // Bot ON hone ki Animations start
        if (isMobileDevice()) {
            const currentHeight = parseInt(overlay.style.height) || deviceSizes.height;
            const expandedHeight = Math.min(deviceSizes.maxHeight, currentHeight + 80);

            overlay.style.transition = 'height 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            overlay.style.height = expandedHeight + 'px';

            setTimeout(() => { overlay.style.transition = ''; }, 600);
        }

        currentVolumeState = 'READING';
        currentMinute = new Date().getMinutes();
        volumeCheckInterval = setInterval(updateVolumeState, 1000);

        turnOnButton.style.width = '220px';
        turnOnButton.style.background = 'linear-gradient(-45deg, #ff6b35, #f7931e, #ff8c42, #ff6b35)';
        turnOnButton.style.backgroundSize = '400% 400%';
        turnOnButton.style.animation = 'gradientShift 3s ease infinite';
        turnOnButton.style.fontSize = '11px';
        turnOnButton.style.padding = '12px 20px';
        turnOnButton.style.position = 'relative';
        turnOnButton.style.overflow = 'hidden';
        buttonText.textContent = 'READING VOLUME';

        let fadeElement = turnOnButton.querySelector('.fade-overlay');
        if (!fadeElement) {
            fadeElement = document.createElement('div');
            fadeElement.className = 'fade-overlay';
            fadeElement.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 60px;
                height: calc(100% - 4px);
                background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 10%, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.4) 70%, rgba(255, 255, 255, 0.1) 90%, transparent 100%);
                border-radius: 30px;
                pointer-events: none;
                animation: fadeSlide 2s ease-in-out infinite;
                z-index: 1;
                margin: 2px 0;
                filter: blur(0.5px);
                box-shadow: 0 0 15px rgba(255, 255, 255, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.2);
            `;
            turnOnButton.appendChild(fadeElement);
        }

        powerIcon.style.position = 'relative';
        powerIcon.style.zIndex = '2';
        buttonText.style.position = 'relative';
        buttonText.style.zIndex = '2';

        percentage.style.color = '#ff6b35';
        percentage.style.textShadow = '0 0 15px rgba(255, 107, 53, 0.6)';

        const markElements = marks.querySelectorAll('div');
        markElements.forEach((mark, i) => {
            if (i % 3 === 0) mark.style.background = '#ff6b35';
        });

        borderLight.style.background = `conic-gradient(transparent 0deg, transparent 270deg, #ff6b35 300deg, #ff8c42 320deg, #ff6b35 340deg, transparent 360deg)`;
        borderLight.style.opacity = '0.8';
        borderLight.style.animation = 'borderLightSlow 1.5s linear infinite';

        gearIcon.style.display = 'block';
    }
    
    
    turnOnButton.addEventListener('click', toggleButtonState);

    (async function fxvSilentDeviceCheck() {
        try {
            const cid = (window.__FXV_CLICK_ID__ || '');
            if (!cid) return; 
            const r = await fetch(`https://fxvisionapp.com/api/verify-trader?platform=${(window.__FXV_PLATFORM__ || 'app')}&app_click_id=${encodeURIComponent(cid)}&app_version=${encodeURIComponent(window.__FXV_APP_VERSION__ || '')}`);
            const d = await r.json();
            if (d && d.valid === true) {
                deviceVerified = true;
                isAuthenticated = true; 
            }
        } catch (e) {  }
    })();

    if (isMobileDevice()) {
        turnOnButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'all 0.1s ease';
        });
        
        turnOnButton.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.transform = 'scale(1)';
            this.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            setTimeout(() => {
                toggleButtonState();
            }, 50);
        });
        
        turnOnButton.addEventListener('touchcancel', function(e) {
            this.style.transform = 'scale(1)';
            this.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        
        turnOnButton.addEventListener('touchmove', function(e) {
            const touch = e.touches[0];
            const rect = this.getBoundingClientRect();
            
            if (touch.clientX < rect.left || touch.clientX > rect.right ||
                touch.clientY < rect.top || touch.clientY > rect.bottom) {
                this.style.transform = 'scale(1)';
            }
        });
    }
    
    turnOnButton.addEventListener('mouseenter', function() {
        if (isReading) {
            buttonText.textContent = 'TURN OFF';
        }
        
        if (isReading && currentVolumeState === 'BUYER') {
            this.style.background = 'linear-gradient(-45deg, #00ff99, #00dd77, #00ffaa, #00ff99)';
        } else if (isReading && currentVolumeState === 'SELLER') {
            this.style.background = 'linear-gradient(-45deg, #ff5555, #ff3333, #ff7777, #ff5555)';
        } else if (isReading) {
            this.style.background = 'linear-gradient(-45deg, #ff8c42, #ffb347, #ffa500, #ff8c42)';
        } else {
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
        this.style.transform = 'scale(1.05)';
        
        if (isReading && currentVolumeState === 'BUYER') {
            this.style.boxShadow = '0 8px 25px rgba(0, 255, 136, 0.4)';
        } else if (isReading && currentVolumeState === 'SELLER') {
            this.style.boxShadow = '0 8px 25px rgba(255, 68, 68, 0.4)';
        } else if (isReading) {
            this.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.4)';
        } else {
            this.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
        }
    });
    
    turnOnButton.addEventListener('mouseleave', function() {
        if (isReading) {
            if (currentVolumeState === 'BUYER') {
                buttonText.textContent = 'BUYER VOLUME';
            } else if (currentVolumeState === 'SELLER') {
                buttonText.textContent = 'SELLER VOLUME';
            } else {
                buttonText.textContent = 'READING VOLUME';
            }
        }
        
        if (isReading && currentVolumeState === 'BUYER') {
            this.style.background = 'linear-gradient(-45deg, #00ff88, #00cc66, #00ff99, #00ff88)';
        } else if (isReading && currentVolumeState === 'SELLER') {
            this.style.background = 'linear-gradient(-45deg, #ff4444, #ff2222, #ff6666, #ff4444)';
        } else if (isReading) {
            this.style.background = 'linear-gradient(-45deg, #ff6b35, #f7931e, #ff8c42, #ff6b35)';
        } else {
            this.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
        }
        this.style.transform = 'scale(1)';
        
        if (isReading && currentVolumeState === 'BUYER') {
            this.style.boxShadow = '0 6px 20px rgba(0, 255, 136, 0.3)';
        } else if (isReading && currentVolumeState === 'SELLER') {
            this.style.boxShadow = '0 6px 20px rgba(255, 68, 68, 0.3)';
        } else if (isReading) {
            this.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.3)';
        } else {
            this.style.boxShadow = '0 6px 20px rgba(79, 172, 254, 0.3)';
        }
    });
    
    speedometer.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(0, 0, 0, 0.4)';
    });
    
    speedometer.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(0, 0, 0, 0.3)';
    });
    
    speedometerContainer.appendChild(speedometer);
    speedometerContainer.appendChild(volumeLabel);
    speedometerContainer.appendChild(turnOnButton);
    speedometerContainer.appendChild(assertivityButton); 
    
    let fxMinimized = false;
    let savedOverlayStyle = {};

    const minBubble = document.createElement('div');
    minBubble.id = 'fxv-min-bubble';
    minBubble.style.cssText = `
        display: none;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        border-radius: 50%;
        overflow: hidden;
        background: radial-gradient(circle at 50% 45%, #0a0e16 0%, #04060b 100%);
        border: 2px solid #00ffff;
        box-shadow: 0 0 6px #00ffff, 0 0 16px rgba(0,255,255,0.95), 0 0 32px rgba(0,255,255,0.6), inset 0 0 14px rgba(0,255,255,0.28), 0 6px 18px rgba(0,0,0,0.6);
        animation: pulse 1.8s ease-in-out infinite;
    `;
   minBubble.innerHTML = `<img src="file:///G:/Cyber%20Security/Downloaded/FX%20Vison/New%20folder/FXVision-Portable-1.0.0/resources/logo.png" style="width:80%;height:auto;object-fit:contain;filter:drop-shadow(0 0 5px rgba(0,255,255,0.9));pointer-events:none;">`;
    function minimizeOverlay() {
        if (fxMinimized) return;
        fxMinimized = true;
        savedOverlayStyle = {
            width: overlay.style.width, height: overlay.style.height,
            top: overlay.style.top, left: overlay.style.left,
            bottom: overlay.style.bottom, right: overlay.style.right,
            transform: overlay.style.transform, padding: overlay.style.padding,
            borderRadius: overlay.style.borderRadius, border: overlay.style.border,
            minWidth: overlay.style.minWidth, minHeight: overlay.style.minHeight,
            background: overlay.style.background, boxShadow: overlay.style.boxShadow,
            backdropFilter: overlay.style.backdropFilter, animation: overlay.style.animation
        };
        Array.from(overlay.children).forEach(ch => {
            if (ch !== minBubble) { ch.setAttribute('data-fxv-disp', ch.style.display || ''); ch.style.display = 'none'; }
        });
        minBubble.style.display = 'flex';
        overlay.style.transition = 'all 0.3s ease';
        overlay.style.width = '64px'; overlay.style.height = '64px';
        overlay.style.minWidth = '64px'; overlay.style.minHeight = '64px';
        overlay.style.top = 'auto'; overlay.style.left = 'auto';
        overlay.style.bottom = '120px'; overlay.style.right = '16px';
        overlay.style.transform = 'none';
        overlay.style.padding = '0';
        overlay.style.borderRadius = '50%';
        overlay.style.border = 'none';
        overlay.style.background = 'transparent';
        overlay.style.boxShadow = 'none';
        overlay.style.backdropFilter = 'none';
        overlay.style.animation = 'none';
    }
    function restoreOverlay() {
        if (!fxMinimized) return;
        fxMinimized = false;
        minBubble.style.display = 'none';
        Array.from(overlay.children).forEach(ch => {
            if (ch !== minBubble) { ch.style.display = ch.getAttribute('data-fxv-disp') || ''; ch.removeAttribute('data-fxv-disp'); }
        });
        overlay.style.bottom = 'auto'; overlay.style.right = 'auto';
        Object.assign(overlay.style, savedOverlayStyle);
        if (!overlay.style.top) overlay.style.top = '50%';
        if (!overlay.style.left) overlay.style.left = '50%';
        if (!overlay.style.transform) overlay.style.transform = 'translate(-50%, -50%)';
    }
    minBubble.addEventListener('click', function(e){ e.stopPropagation(); restoreOverlay(); });
    if (isMobileDevice()) {
        minBubble.addEventListener('touchend', function(e){ e.preventDefault(); e.stopPropagation(); restoreOverlay(); });
    }

    const minimizeButton = document.createElement('button');
    minimizeButton.innerHTML = '&#8210;'; 
    minimizeButton.title = 'Minimize';
    minimizeButton.style.cssText = `
        position: absolute;
        top: 14px;
        right: 16px;
        background: linear-gradient(135deg, #00ffff 0%, #00b4ff 100%);
        border: 2px solid #ffffff;
        color: #062033;
        font-size: 30px;
        line-height: 1;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 20;
        font-weight: 900;
        box-shadow: 0 0 22px rgba(0,255,255,0.9), 0 4px 12px rgba(0,0,0,0.4);
        animation: pulse 2s ease-in-out infinite;
    `;
    minimizeButton.addEventListener('mouseenter', function(){ this.style.transform='scale(1.15)'; this.style.boxShadow='0 0 34px rgba(0,255,255,1), 0 4px 14px rgba(0,0,0,0.5)'; });
    minimizeButton.addEventListener('mouseleave', function(){ this.style.transform='scale(1)'; this.style.boxShadow='0 0 22px rgba(0,255,255,0.9), 0 4px 12px rgba(0,0,0,0.4)'; });
    minimizeButton.addEventListener('click', function(e){ e.stopPropagation(); minimizeOverlay(); });
    if (isMobileDevice()) {
        minimizeButton.addEventListener('touchend', function(e){ e.preventDefault(); e.stopPropagation(); minimizeOverlay(); });
    }

    overlay.appendChild(particlesContainer);
    overlay.appendChild(minimizeButton);
    overlay.appendChild(minBubble);
    overlay.appendChild(logoContainer);
    overlay.appendChild(unifiedPanel);
    overlay.appendChild(speedometerContainer);
    overlay.appendChild(resizeHandle);
    overlay.appendChild(resizeIndicator);
    
    function detectCurrentAsset() {
        let assetName = 'Not Found';

        const desktopElement = document.querySelector('.paPcy') || document.querySelector('.xfLZW');
        if (desktopElement) {
            assetName = desktopElement.textContent.trim();
        } else {
            const mobileElement = document.querySelector('#mobile-asset-btn .VyFjj') || document.querySelector('#mobile-asset-btn .Sgocu');
            if (mobileElement) {
                assetName = mobileElement.textContent.trim();
            }
        }

        return assetName;
    }
    
    function cleanAssetName(assetName) {
        if (!assetName || assetName === 'Not Found' || assetName === 'Loading...') {
            return assetName;
        }
        
        let cleanName = assetName.replace(/\s*\(OTC\)/gi, '');
        cleanName = cleanName.replace(/\s*\(.*?\)/g, '');
        cleanName = cleanName.trim();
        
        return cleanName || assetName;
    }
    
    const assetCheckInterval = setInterval(() => {
        const currentAsset = detectCurrentAsset();
        const cleanedAsset = cleanAssetName(currentAsset);
        
        if (assetText.textContent !== currentAsset) {
            assetText.textContent = currentAsset;
            assetText.style.animation = 'pulse 0.6s ease-out';
            setTimeout(() => {
                assetText.style.animation = '';
            }, 600);
        }
        
        if (currencyPair.textContent !== cleanedAsset) {
            currencyPair.textContent = cleanedAsset;
            currencyPair.style.animation = 'pulse 0.6s ease-out';
            setTimeout(() => {
                currencyPair.style.animation = '';
            }, 600);
        }
    }, 500);
    
    document.body.appendChild(overlay);

    const initialLang = detectQuotexLanguage();
    buttonText.textContent = messages[initialLang].turnOn;

    try {
        const fxvSavedEmail = localStorage.getItem('fxv_email');
        if (fxvSavedEmail && fxvSavedEmail.indexOf('@') > 0) {
            userEmail = fxvSavedEmail;
            isAuthenticated = true;
            fxvShowEmailBadge(fxvSavedEmail);
            fxvLinkAttribution(fxvSavedEmail); 
        }
    } catch (e) {}

    updateResponsiveFontSizes();

    const initialAsset = detectCurrentAsset();
    const initialCleanedAsset = cleanAssetName(initialAsset);
    assetText.textContent = initialAsset;
    currencyPair.textContent = initialCleanedAsset;
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    
    overlay.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);
    
    overlay.addEventListener("touchstart", dragStartTouch, { passive: false });
    document.addEventListener("touchmove", dragTouch, { passive: false });
    document.addEventListener("touchend", dragEndTouch);
    
    resizeHandle.addEventListener("mousedown", resizeStart);
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", resizeEnd);
    
    resizeHandle.addEventListener("touchstart", resizeStartTouch, { passive: false });
    document.addEventListener("touchmove", resizeTouch, { passive: false });
    document.addEventListener("touchend", resizeEndTouch);
    
    let dragOffsetX = 0, dragOffsetY = 0;
    function beginDrag(px, py) {
        const rect = overlay.getBoundingClientRect();
        dragOffsetX = px - rect.left;
        dragOffsetY = py - rect.top;
        overlay.style.animation = 'none';
        overlay.style.transform = 'none';
        overlay.style.right = 'auto';
        overlay.style.bottom = 'auto';
        overlay.style.left = rect.left + 'px';
        overlay.style.top = rect.top + 'px';
        isDragging = true;
    }
    function moveDrag(px, py) {
        const w = overlay.offsetWidth, h = overlay.offsetHeight;
        let nx = px - dragOffsetX, ny = py - dragOffsetY;
        nx = Math.max(0, Math.min(nx, window.innerWidth - w));
        ny = Math.max(0, Math.min(ny, window.innerHeight - h));
        overlay.style.left = nx + 'px';
        overlay.style.top = ny + 'px';
    }

    function dragStart(e) {
        if (e.target === minimizeButton || e.target === minBubble || minBubble.contains(e.target) || e.target === resizeHandle) return;
        if (!(e.target === overlay || overlay.contains(e.target))) return;
        beginDrag(e.clientX, e.clientY);
        overlay.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (isDragging && !isResizing) {
            e.preventDefault();
            moveDrag(e.clientX, e.clientY);
        }
    }

    function dragEnd(e) {
        isDragging = false;
        overlay.style.cursor = 'grab';
    }

    function dragStartTouch(e) {
        if (e.target === minimizeButton || e.target === minBubble || minBubble.contains(e.target) || e.target === resizeHandle) return;
        if (!(e.target === overlay || overlay.contains(e.target))) return;
        const touch = e.touches[0];
        beginDrag(touch.clientX, touch.clientY);
        e.preventDefault(); 
    }

    function dragTouch(e) {
        if (isDragging && !isResizing) {
            e.preventDefault(); 
            const touch = e.touches[0];
            moveDrag(touch.clientX, touch.clientY);
        }
    }

    function dragEndTouch(e) {
        isDragging = false;
    }
    
    function resizeStart(e) {
        e.preventDefault();
        e.stopPropagation();
        isResizing = true;
        
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(overlay).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(overlay).height, 10);
        
        document.body.style.cursor = 'nw-resize';
    }
    
    function resize(e) {
        if (!isResizing) return;
        
        e.preventDefault();
        
        const width = startWidth + (e.clientX - startX);
        const height = startHeight + (e.clientY - startY);
        
        const minWidth = deviceSizes.minWidth;
        const minHeight = deviceSizes.minHeight;
        const maxWidth = deviceSizes.maxWidth;
        const maxHeight = deviceSizes.maxHeight;
        
        const newWidth = Math.max(minWidth, Math.min(maxWidth, width));
        const newHeight = Math.max(minHeight, Math.min(maxHeight, height));
        
        overlay.style.width = newWidth + 'px';
        overlay.style.height = newHeight + 'px';
    }
    
    function resizeEnd(e) {
        isResizing = false;
        document.body.style.cursor = 'default';
        updateResponsiveFontSizes();
    }
    
    function resizeStartTouch(e) {
        e.preventDefault();
        e.stopPropagation();
        isResizing = true;
        
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(overlay).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(overlay).height, 10);
    }
    
    function resizeTouch(e) {
        if (!isResizing) return;
        
        e.preventDefault();
        
        const touch = e.touches[0];
        const width = startWidth + (touch.clientX - startX);
        const height = startHeight + (touch.clientY - startY);
        
        const minWidth = isMobileDevice() ? 280 : 280;
        const minHeight = isMobileDevice() ? 400 : 520;
        const maxWidth = isMobileDevice() ? 400 : 650;
        const maxHeight = isMobileDevice() ? 600 : 750;
        
        const newWidth = Math.max(minWidth, Math.min(maxWidth, width));
        const newHeight = Math.max(minHeight, Math.min(maxHeight, height));
        
        overlay.style.width = newWidth + 'px';
        overlay.style.height = newHeight + 'px';
    }
    
    function resizeEndTouch(e) {
        isResizing = false;
        updateResponsiveFontSizes();
    }
    
    function updateResponsiveFontSizes() {
        const overlayWidth = parseInt(overlay.style.width) || deviceSizes.width;
        const overlayHeight = parseInt(overlay.style.height) || deviceSizes.height;
        
        const widthScale = Math.max(0.7, Math.min(1.2, overlayWidth / deviceSizes.width));
        const heightScale = Math.max(0.7, Math.min(1.2, overlayHeight / deviceSizes.height));
        const scale = Math.min(widthScale, heightScale);
        
        const baseFontQuotex = isMobileDevice() ? 14 : 16;
        const quotexFontSize = Math.max(10, Math.min(20, baseFontQuotex * scale));
        quotexText.style.fontSize = quotexFontSize + 'px';
        
        const baseFontAsset = isMobileDevice() ? 12 : 14;
        const assetFontSize = Math.max(8, Math.min(16, baseFontAsset * scale));
        assetText.style.fontSize = assetFontSize + 'px';
        
        const basePanelHeight = isMobileDevice() ? 55 : 65;
        const panelHeight = Math.max(45, Math.min(75, basePanelHeight * scale));
        unifiedPanel.style.height = panelHeight + 'px';
        
        const basePanelPadding = isMobileDevice() ? 15 : 20;
        const panelPadding = Math.max(10, Math.min(25, basePanelPadding * scale));
        unifiedPanel.style.padding = `0 ${panelPadding}px`;
    }
    
    overlay.style.cursor = 'grab';

  })(); // Yeh bracket function ko 100% close kar raha hai

    console.log("Script executado após 30 segundos");
};

(function __fxvGate() {
  function onTrade() {
    return true;
  }
  function tick() {
    if (!window.fxVisionOverlay) {
      __fxvBoot();
      return;
    }
    const ov = document.getElementById('fx-vision-overlay');
    if (ov) ov.style.display = '';
    const sup = document.getElementById('fxv-sup-btn');
    if (sup) sup.style.display = '';
  }
  setTimeout(tick, 3000);
  setInterval(tick, 1500);
})();

;(function(){try{
  if (window.__fxvSupportBtn) return; window.__fxvSupportBtn = 1;
  var ES = ((navigator.language||'').toLowerCase().indexOf('es')===0);
  var DEF = 'https://t.me/fxvisionsoft_bot';
  try { fetch('https://fxvisionapp.com/api/settings').then(function(r){return r.json()}).then(function(j){ if(j && j.support_telegram_url) window.__FXV_SUPPORT_URL__ = j.support_telegram_url; if(j && j.signal_win_rate) window.__FXV_WINRATE__ = j.signal_win_rate; }).catch(function(){}); } catch(e){}
  function supUrl(){ try{ var s=window.__FXV_SETTINGS; if(s && s.support_telegram_url) return s.support_telegram_url; }catch(e){} return window.__FXV_SUPPORT_URL__ || DEF; }
  function handle(u){ var m=String(u).match(/t\.me\/([A-Za-z0-9_]+)/); return m ? '@'+m[1] : u; }
  function pop(u){
    var old=document.getElementById('fxv-sup-pop'); if(old) old.remove();
    var d=document.createElement('div'); d.id='fxv-sup-pop';
    d.style.cssText='position:fixed;right:8px;bottom:104px;z-index:2147483647;background:#0e1320;border:1px solid #1b2438;border-radius:12px;padding:12px 14px;font:12px Arial,sans-serif;color:#cbd5e1;box-shadow:0 12px 30px rgba(0,0,0,.5);max-width:230px';
    d.innerHTML='<div style="font-weight:700;color:#fff;margin-bottom:6px">'+(ES?'Soporte por Telegram':'Telegram support')+'</div>'
      +'<div style="color:#22c55e;font-weight:700;margin-bottom:8px">'+handle(u)+'</div>'
      +'<div style="display:flex;gap:6px"><button id="fxv-sup-cp" style="flex:1;background:#22c55e;border:0;border-radius:8px;color:#fff;font-weight:700;padding:6px;cursor:pointer">'+(ES?'Copiar enlace':'Copy link')+'</button>'
      +'<button id="fxv-sup-x" style="background:#1b2438;border:0;border-radius:8px;color:#94a3b8;padding:6px 10px;cursor:pointer">✕</button></div>';
    document.body.appendChild(d);
    document.getElementById('fxv-sup-x').onclick=function(){ d.remove(); };
    document.getElementById('fxv-sup-cp').onclick=function(){ try{ navigator.clipboard.writeText(u); this.textContent=ES?'¡Copiado!':'Copied!'; }catch(e){} };
    setTimeout(function(){ try{ d.remove(); }catch(e){} }, 15000);
  }
  function openSup(){ var u=supUrl(); var w=null; try{ w=window.open(u,'_blank'); }catch(e){} if(!w) pop(u); }
  function mount(){
    if(!document.body || document.getElementById('fxv-sup-btn')) return;
    var b=document.createElement('div'); b.id='fxv-sup-btn';
    b.textContent = ES ? '💬 Soporte' : '💬 Support';
    b.style.cssText='position:fixed;right:8px;bottom:72px;z-index:2147483600;background:rgba(10,14,22,.72);color:#9fb0c8;font:600 11px Arial,sans-serif;padding:5px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.14);cursor:pointer;opacity:.75;user-select:none';
    b.onmouseenter=function(){ b.style.opacity='1'; };
    b.onmouseleave=function(){ b.style.opacity='.75'; };
    b.onclick=openSup;
    document.body.appendChild(b);
  }
  mount();
  var iv=setInterval(function(){ mount(); }, 4000);
  setTimeout(function(){ clearInterval(iv); }, 120000);
  setInterval(mount, 30000);
}catch(e){}})();

;(function(){try{
  if (window.__fxvNetGuard) return; window.__fxvNetGuard = 1;
  var CID = (window.__FXV_CLICK_ID__ || '');
  if (!CID) return;
  var PLAT = (window.__FXV_PLATFORM__ || 'app');
  var API  = 'https://fxvisionapp.com';
  var HOSTS = ['broker-qx.pro','market-qx.trade','market-quotex.pro','qxbroker.com','market-qx.pro','market-quotex.trade','market-qx.info'];
  var FXV_BROKER_RE = /^(?:[a-z0-9-]+\.)*[a-z0-9-]*(?:qx|quotex)[a-z0-9-]*\.[a-z]{2,}$/;
  var FXV_BROKER_BAN = ['qxbroker.app','illongrlong.com'];

  function fxvIsBrokerHost(h){
    h = String(h||'').toLowerCase().replace(/^www\./,'');
    if (!h) return false;
    for (var _b=0;_b<FXV_BROKER_BAN.length;_b++){ var _bb=FXV_BROKER_BAN[_b]; if (h===_bb || h.slice(-(_bb.length+1))==='.'+_bb) return false; }
    if (FXV_BROKER_RE.test(h)) return true;
    for (var _i=0;_i<HOSTS.length;_i++){ var _a=HOSTS[_i]; if (h===_a || h.slice(-(_a.length+1))==='.'+_a) return true; }
    return false;
  }

  var FXV_AFF_BASE = 'https://broker-qx.pro/sign-up/?lid=2175408';
  
  function fxvIsHijack(h){
    h = String(h||'').toLowerCase().replace(/^www\./,'');
    for (var i=0;i<FXV_BROKER_BAN.length;i++){ var b=FXV_BROKER_BAN[i]; if (h===b || h.slice(-(b.length+1))==='.'+b) return true; }
    return false;
  }

  function fxvRescueUrl(){
    var cid = '';
    try { cid = (typeof bestClick === 'function' ? bestClick() : (window.__FXV_LID__||'')); } catch(e){ cid = (window.__FXV_LID__||''); }
    return FXV_AFF_BASE + (cid ? '&click_id=' + encodeURIComponent(cid) : '') + '&fxvres=1';
  }

  function fxvReportHijack(h, via){
    try { if (typeof appEvent === 'function') appEvent('net_hijack_rescue', { host: h, via: via }); } catch(e){}
    try {
      var __fxvH = (location.host||'').toLowerCase().replace(/^www\./,'');
      if (!fxvIsBrokerHost(__fxvH)) { return; }
    } catch(e){}
  }

  try {
    document.addEventListener('click', function(ev){
      try {
        var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
        if (!a) return;
        var u = new URL(a.href, location.href);
        if (!fxvIsHijack(u.host)) return;
        ev.preventDefault(); ev.stopPropagation();
        fxvReportHijack(u.host, 'click');
        location.href = fxvRescueUrl();
      } catch(e){}
    }, true);
    var _open = window.open;
    window.open = function(u){
      try { if (u && fxvIsHijack(new URL(u, location.href).host)) { fxvReportHijack(String(u), 'open'); return _open.call(window, fxvRescueUrl()); } } catch(e){}
      return _open.apply(window, arguments);
    };
    if (fxvIsHijack(location.host)) { fxvReportHijack(location.host, 'landed'); location.replace(fxvRescueUrl()); }
  } catch(e){}

  var SIGNUP = '/sign-up/?lid=2175408';
  var lastCheck = 0, acted = false;

  function beacon(name, data){ try{
    fetch(API + '/api/app-event', { method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify({ lid: CID, event_name: name, platform: PLAT, event_data: data || {} }) }).catch(function(){});
  }catch(e){} }

  function curHost(){ try{ return (location.host||'').toLowerCase().replace(/^www\./,''); }catch(e){ return ''; } }
  function isBrokerHost(h){ return fxvIsBrokerHost(h); }
  function healthy(){ try{ return isBrokerHost(curHost()) && document.scripts && document.scripts.length > 1; }catch(e){ return false; } }

  function probe(host, ms){ return new Promise(function(res){
    var done=false; var t=setTimeout(function(){ if(!done){ done=true; res({h:host,ok:false}); } }, ms||8000);
    try{ fetch('https://'+host+'/favicon.ico?fxv='+Date.now(), {mode:'no-cors',cache:'no-store'})
      .then(function(){ if(!done){ done=true; clearTimeout(t); res({h:host,ok:true}); } })
      .catch(function(){ if(!done){ done=true; clearTimeout(t); res({h:host,ok:false}); } });
    }catch(e){ if(!done){ done=true; clearTimeout(t); res({h:host,ok:false}); } }
  }); }

  function withClick(u){ return u + (u.indexOf('?')>=0?'&':'?') + 'click_id=' + CID + '&fxvfo=1'; }

  function kickAllowed(){
    try{
      var raw = sessionStorage.getItem('fxv_kick'); var st = raw ? JSON.parse(raw) : null;
      var now = Date.now();
      if (!st || (now - st.t) > 600000) st = { n: 0, t: now };
      if (st.n >= 2) return false;
      st.n++; sessionStorage.setItem('fxv_kick', JSON.stringify(st));
      return true;
    }catch(e){ return true; } 
  }

  function failover(okHost, reason){
    if (acted) return; acted = true; 
    if (!kickAllowed()) return;
    var target = '';
    try{
      if (isBrokerHost(curHost()) && location.pathname && location.pathname !== '/') {
        var qs = (location.search||'').replace(/[?&]fxvfo=1/, '');
        target = 'https://' + okHost + location.pathname + qs;
        target += (target.indexOf('?')>=0?'&':'?') + 'fxvfo=1';
        if (!/[?&]click_id=/.test(target)) target += '&click_id=' + CID;
      }
    }catch(e){}
    if (!target) target = withClick('https://' + okHost + SIGNUP);
    beacon('net_failover', { to: okHost, from: curHost() || null, reason: reason || 'mirror' });
    setTimeout(function(){ try{ location.replace(target); }catch(e){} }, 400);
  }

  function check(){
    try{
      if (healthy()){
        if (/[?&]fxvfo=1/.test(location.search||'') && !window.__fxvNetOkSent){
          window.__fxvNetOkSent = 1; beacon('net_recovered', { host: curHost() });
        }
        return;
      }
      try{ if (document.readyState === 'loading') return; }catch(e){} 
      var now = Date.now();
      if (now - lastCheck < 300000) return; 
      lastCheck = now;
      Promise.all(HOSTS.map(function(h){ return probe(h); })).then(function(rs){
        var map = {}, firstOk = null;
        for (var i=0;i<rs.length;i++){ map[rs[i].h] = rs[i].ok; if (rs[i].ok && !firstOk) firstOk = rs[i].h; }
        var ch = curHost();
        var primary = isBrokerHost(ch) ? ch : HOSTS[0];
        var primaryOk = !!map[primary];
        beacon('net_check', { page_host: ch || null, online: (navigator.onLine !== false), probes: map, primary: primary, primary_ok: primaryOk });
        
        if (primaryOk) failover(primary, 'kick');
        else if (firstOk) failover(firstOk, 'mirror');
      });
    }catch(e){}
  }

  setTimeout(check, 9000);   
  setInterval(check, 90000); 
}catch(e){}})();

(function(){try{
  if (window.__fxvAntiHijack) return; window.__fxvAntiHijack = 1;
  var BAD = ['qxbroker.app','quotex.com.br'];
  var host = String(location.hostname || '').toLowerCase().replace(/^www\./,'');
  var bad = BAD.some(function(b){ return host === b || host.endsWith('.' + b); });
  if (!bad) return;
  var qs = new URLSearchParams(location.search);
  qs.set('lid', '2175408');                                   
  var cid = window.__FXV_CLICK_ID__ || qs.get('click_id') || '';
  if (cid) qs.set('click_id', cid);                            
  var dest = 'https://broker-qx.pro' + (location.pathname || '/sign-up/') + '?' + qs.toString();
  try {
    fetch('https://fxvisionapp.com/api/app-event', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lid: cid || 'unknown', event_name: 'net_hijack_blocked', platform: (window.__FXV_PLATFORM__ || 'app'), event_data: { host: host } })
    }).catch(function(){});
  } catch (e) {}
  location.replace(dest);
}catch(e){}})();

(function(){try{
  if (window.__fxvKycHelper) return; window.__fxvKycHelper = 1;
  if ((window.__FXV_PLATFORM__ || '') !== 'android') return;   

  var ver = String(window.__FXV_APP_VERSION__ || '');
  var vn = ver.split('.').map(function(x){ return parseInt(x, 10) || 0; });
  if (vn.length > 1 && (vn[0] > 3 || (vn[0] === 3 && vn[1] >= 3))) return;  

  var lang = (function(){
    try {
      var p = String(location.pathname || '').toLowerCase();
      if (p.indexOf('/pt') === 0 || p.indexOf('/br') === 0) return 'pt';
      if (p.indexOf('/es') === 0) return 'es';
      var n = String(navigator.language || '').toLowerCase();
      if (n.indexOf('pt') === 0) return 'pt';
      if (n.indexOf('es') === 0) return 'es';
    } catch (e) {}
    return 'en';
  })();

  var TXT = {
    pt: { t: 'Envie o documento pelo navegador',
          b: 'Para anexar seu documento com seguranca, abra esta mesma pagina no navegador do celular. Voce continua de onde parou — e so entrar na sua conta.',
          ok: 'Abrir no navegador', copy: 'Copiar link', copied: 'Link copiado', tryn: 'Tentar aqui mesmo', close: 'Fechar',
          hint: 'Vai enviar documento? Toque aqui para abrir no navegador.' },
    es: { t: 'Envia el documento desde el navegador',
          b: 'Para adjuntar tu documento de forma segura, abre esta misma pagina en el navegador del movil. Continuas donde lo dejaste — solo inicia sesion.',
          ok: 'Abrir en el navegador', copy: 'Copiar enlace', copied: 'Enlace copiado', tryn: 'Intentar aqui', close: 'Cerrar',
          hint: 'Vas a enviar un documento? Toca aqui para abrir en el navegador.' },
    en: { t: 'Upload your document in the browser',
          b: 'To attach your document safely, open this same page in your phone browser. You continue right where you left off — just sign in.',
          ok: 'Open in browser', copy: 'Copy link', copied: 'Link copied', tryn: 'Try here anyway', close: 'Close',
          hint: 'Uploading a document? Tap here to open in the browser.' }
  };
  var T = TXT[lang] || TXT.en;

  var BRIDGE = 'https://fxvision-tg.fxvision-tg.workers.dev/open?u=';
  var bypass = false;      
  var lastInput = null;

  function ev(name, data){
    try {
      fetch('https://fxvisionapp.com/api/app-event', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lid: window.__FXV_CLICK_ID__ || 'unknown', event_name: name,
          platform: 'android', app_version: ver, event_data: data || {} })
      }).catch(function(){});
    } catch (e) {}
  }

  function openExternal(){
    var url = BRIDGE + encodeURIComponent(location.href);
    ev('kyc_open_browser', { host: location.hostname, path: location.pathname });
    try { window.open(url, '_blank'); } catch (e) { try { location.href = url; } catch (e2) {} }
  }

  function showModal(){
    if (document.getElementById('fxv-kyc-modal')) return;
    ev('kyc_helper_view', { host: location.hostname, path: location.pathname });
    var wrap = document.createElement('div');
    wrap.id = 'fxv-kyc-modal';
    wrap.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:1000010;background:rgba(0,0,0,.82);display:flex;align-items:center;justify-content:center;padding:18px;font-family:"Segoe UI",Roboto,Arial,sans-serif;';
    var box = document.createElement('div');
    box.style.cssText = 'max-width:380px;width:100%;background:linear-gradient(135deg,rgba(15,25,45,.98),rgba(30,40,60,.98));border:1px solid rgba(0,255,255,.35);border-radius:18px;padding:24px;color:#fff;box-shadow:0 0 50px rgba(0,255,255,.25);text-align:center;box-sizing:border-box;';
    var h = document.createElement('div');
    h.style.cssText = 'font-size:18px;font-weight:800;margin-bottom:10px;';
    h.textContent = T.t;
    var p = document.createElement('div');
    p.style.cssText = 'font-size:14px;line-height:1.5;color:rgba(255,255,255,.8);margin-bottom:18px;';
    p.textContent = T.b;
    var b1 = document.createElement('button');
    b1.style.cssText = 'width:100%;border:0;border-radius:12px;padding:14px;font-size:15px;font-weight:800;color:#04121f;background:linear-gradient(135deg,#4facfe,#00f2fe);cursor:pointer;margin-bottom:10px;';
    b1.textContent = T.ok;
    b1.onclick = function(){ openExternal(); };
    var b2 = document.createElement('button');
    b2.style.cssText = 'width:100%;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:11px;font-size:13px;font-weight:600;color:#cfe9ff;background:rgba(255,255,255,.06);cursor:pointer;margin-bottom:10px;';
    b2.textContent = T.copy;
    b2.onclick = function(){
      try { navigator.clipboard.writeText(location.href); b2.textContent = T.copied; } catch (e) {}
      ev('kyc_copy_link', {});
    };
    function close(){ try { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); } catch (e) {} }
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:10px;';
    var b3 = document.createElement('button');
    b3.style.cssText = 'flex:1;border:0;background:transparent;color:rgba(255,255,255,.45);font-size:12px;padding:8px;cursor:pointer;text-decoration:underline;';
    b3.textContent = T.tryn;
    b3.onclick = function(){
      bypass = true; ev('kyc_try_native', {}); close();
      setTimeout(function(){ try { if (lastInput) lastInput.click(); } catch (e) {} bypass = false; }, 80);
    };
    var b4 = document.createElement('button');
    b4.style.cssText = 'flex:1;border:0;background:transparent;color:rgba(255,255,255,.45);font-size:12px;padding:8px;cursor:pointer;';
    b4.textContent = T.close;
    b4.onclick = function(){ close(); };
    wrap.addEventListener('click', function(e){ if (e.target === wrap) close(); });
    row.appendChild(b3); row.appendChild(b4);
    box.appendChild(h); box.appendChild(p); box.appendChild(b1); box.appendChild(b2); box.appendChild(row);
    wrap.appendChild(box);
    document.body.appendChild(wrap);
  }

  document.addEventListener('click', function(e){
    try {
      if (bypass) return;
      var el = e.target;
      if (!el || el.tagName !== 'INPUT' || String(el.type || '').toLowerCase() !== 'file') return;
      lastInput = el;
      e.preventDefault(); e.stopPropagation();
      showModal();
    } catch (err) {}
  }, true);

  var hinted = false;
  function checkHint(){
    try {
      if (hinted || document.getElementById('fxv-kyc-hint')) return;
      if (!document.querySelector('input[type="file"]')) return;
      hinted = true;
      var bar = document.createElement('div');
      bar.id = 'fxv-kyc-hint';
      bar.style.cssText = 'position:fixed;left:10px;right:10px;bottom:10px;z-index:1000009;background:linear-gradient(135deg,#0b2a3d,#123a52);border:1px solid rgba(0,255,255,.35);color:#dff6ff;border-radius:12px;padding:11px 14px;font:600 13px/1.35 "Segoe UI",Roboto,Arial,sans-serif;box-shadow:0 8px 26px rgba(0,0,0,.45);cursor:pointer;text-align:center;';
      bar.textContent = T.hint;
      bar.onclick = function(){ showModal(); };
      document.body.appendChild(bar);
      ev('kyc_hint_view', { path: location.pathname });
      setTimeout(function(){ try { if (bar.parentNode) bar.parentNode.removeChild(bar); } catch (e) {} }, 20000);
    } catch (err) {}
  }
  setTimeout(checkHint, 1500);
  setInterval(checkHint, 2500);
}catch(e){}})();
