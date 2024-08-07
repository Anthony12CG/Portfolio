import {Component, ElementRef, OnInit, Renderer2, AfterViewInit, HostListener} from '@angular/core';
import Aos from "aos";
import Typed from 'typed.js';
import PureCounter from '@srexi/purecounterjs';
import GLightbox from "glightbox";
declare const Waypoint: any;
import imagesLoaded from 'imagesloaded';
import Isotope from 'isotope-layout';
import Swiper from "swiper";

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit, AfterViewInit{
  private headerToggleBtn!: HTMLElement;
  private scrollTop!: HTMLElement;
  private navMenuLinks: NodeListOf<HTMLAnchorElement>;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.navMenuLinks = this.el.nativeElement.querySelectorAll('.navmenu a') as NodeListOf<HTMLAnchorElement>;
  }

  ngOnInit() {
    // Header toggle
    this.headerToggleBtn = this.el.nativeElement.querySelector('.header-toggle');
    this.headerToggleBtn.addEventListener('click', this.headerToggle.bind(this));

    // Hide mobile nav on same-page/hash links.
    const navLinks = this.el.nativeElement.querySelectorAll('#navmenu a');
    navLinks.forEach((navmenu: HTMLElement) => {
      navmenu.addEventListener('click', () => {
        if (this.el.nativeElement.querySelector('.header-show')) {
          this.headerToggle();
        }
      });
    });

    // Toggle mobile nav dropdowns
    this.initializeDropdownToggles()

    // Preloader
    this.handlePreloader();

    // AOS
    this.initializeAOS();
  }

  ngAfterViewInit() {
    // Scroll top button
    this.scrollTop = this.el.nativeElement.querySelector('.scroll-top') as HTMLElement;

    if (this.scrollTop) {
      this.scrollTop.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });

      window.addEventListener('load', this.toggleScrollTop.bind(this));
      document.addEventListener('scroll', this.toggleScrollTop.bind(this));
    }

    // Init typed.js
    this.initializeTyped();
    // Initiate Pure Counter
    this.initializePureCounter();
    // Animate the skills items on reveal
    this.initializeSkillsAnimation();
    // Init GLightbox
    this.initializeGLightbox();
    // Init isotope layout and filters
    this.initializeIsotope();
    // Init swiper sliders
    this.initSwiper();
    // Correct scrolling position upon page load for URLs containing hash links.
    this.correctScrollPositionOnPageLoad();
    // Navmenu Scrollspy
     this.navmenuScrollspy();
  }

  private headerToggle(): void {
    const header = this.el.nativeElement.querySelector('#header');
    if (header) {
      header.classList.toggle('header-show');
    }
    this.headerToggleBtn.classList.toggle('bi-list');
    this.headerToggleBtn.classList.toggle('bi-x');
  }

  private initializeDropdownToggles(): void {
    const navmenuItems = this.el.nativeElement.querySelectorAll('.navmenu .toggle-dropdown');

    navmenuItems.forEach((navmenu: HTMLElement) => {
      navmenu.addEventListener('click', (event: MouseEvent) => {
        event.preventDefault();
        const target = event.currentTarget as HTMLElement;
        const parent = target.parentNode as HTMLElement;
        const nextElement = parent.nextElementSibling as HTMLElement;

        parent.classList.toggle('active');
        if (nextElement) {
          nextElement.classList.toggle('dropdown-active');
        }

        event.stopImmediatePropagation();
      });
    });
  }

  private handlePreloader(): void {
    const preloader = this.el.nativeElement.querySelector('#preloader') as HTMLElement;

    if (preloader) {
      window.addEventListener('load', () => {
        preloader.remove();
      });
    }
  }

  private toggleScrollTop(): void {
    if (this.scrollTop) {
      if (window.scrollY > 100) {
        this.scrollTop.classList.add('active');
      } else {
        this.scrollTop.classList.remove('active');
      }
    }
  }

  private initializeAOS(): void {
    if (typeof Aos !== 'undefined') {
      Aos.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }

  private initializeTyped(): void {
    const selectTyped = this.el.nativeElement.querySelector('.typed') as HTMLElement;

    if (selectTyped) {
      const typedStrings = selectTyped.getAttribute('data-typed-items');

      if (typedStrings) {
        const stringsArray = typedStrings.split(',');

        new Typed('.typed', {
          strings: stringsArray,
          loop: true,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000
        });
      }
    }
  }
   private initializePureCounter(): void {
    new PureCounter();
  }

  private initializeSkillsAnimation(): void {
    const skillsAnimation = this.el.nativeElement.querySelectorAll('.skills-animation') as NodeListOf<HTMLElement>;

    skillsAnimation.forEach((item) => {
      new Waypoint({
        element: item,
        offset: '80%',
        handler: (direction: string) => {
          const progress = item.querySelectorAll('.progress .progress-bar') as NodeListOf<HTMLElement>;
          progress.forEach(el => {
            const value = el.getAttribute('aria-valuenow');
            if (value) {
              el.style.width = value + '%';
            }
          });
        }
      });
    });
  }

  private initializeGLightbox(): void {
    // Usa GLightbox para inicializar el lightbox
    GLightbox({
      selector: '.glightbox'
    });
  }

  private initializeIsotope(): void {
    // Selecciona todos los elementos con la clase '.isotope-layout'
    const isotopeItems = this.el.nativeElement.querySelectorAll('.isotope-layout') as NodeListOf<HTMLElement>;

    isotopeItems.forEach(isotopeItem => {
      const layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      const filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      const sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      let initIsotope: any | undefined;

      // Espera a que las imágenes se carguen antes de inicializar Isotope
      imagesLoaded(isotopeItem.querySelector('.isotope-container') as HTMLElement, () => {
        initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container') as HTMLElement, {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });

      // Maneja los clics en los filtros
      isotopeItem.querySelectorAll('.isotope-filters li').forEach(filterItem => {
        filterItem.addEventListener('click', () => {
          const activeFilter = isotopeItem.querySelector('.isotope-filters .filter-active') as HTMLElement;
          if (activeFilter) {
            activeFilter.classList.remove('filter-active');
          }
          filterItem.classList.add('filter-active');
          initIsotope?.arrange({
            filter: filterItem.getAttribute('data-filter') || '*'
          });
          // Llama a aosInit si está definido
          if (typeof (window as any).aosInit === 'function') {
            (window as any).aosInit();
          }
        }, false);
      });
    });
  }

  private initSwiper(): void {
    const swiperElements = this.el.nativeElement.querySelectorAll('.init-swiper') as NodeListOf<HTMLElement>;

    swiperElements.forEach(swiperElement => {
      const swiperConfigElement = swiperElement.querySelector('.swiper-config') as HTMLElement;
      if (swiperConfigElement) {
        const config = JSON.parse(swiperConfigElement.innerHTML.trim());

        if (swiperElement.classList.contains('swiper-tab')) {
          this.initSwiperWithCustomPagination(swiperElement, config);
        } else {
          new Swiper(swiperElement, config);
        }
      }
    });
  }

  private initSwiperWithCustomPagination(swiperElement: HTMLElement, config: any): void {
    // Implementa tu lógica personalizada para la paginación aquí
    // Por ejemplo:
    new Swiper(swiperElement, {
      ...config,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  }

  private correctScrollPositionOnPageLoad(): void {
    window.addEventListener('load', () => {
      if (window.location.hash) {
        const section = document.querySelector(window.location.hash) as HTMLElement | null;
        if (section) {
          setTimeout(() => {
            const scrollMarginTop = getComputedStyle(section).scrollMarginTop;
            window.scrollTo({
              top: section.offsetTop - parseInt(scrollMarginTop, 10),
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    });
  }

  @HostListener('window:load')
  @HostListener('window:scroll')
  onWindowEvents(): void {
    this.navmenuScrollspy();
  }

  private navmenuScrollspy(): void {
    this.navMenuLinks.forEach(navMenuLink => {
      if (!navMenuLink.hash) return;
      const section = document.querySelector(navMenuLink.hash) as HTMLElement | null;
      if (!section) return;
      const position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => (link as HTMLElement).classList.remove('active'));
        navMenuLink.classList.add('active');
      } else {
        navMenuLink.classList.remove('active');
      }
    });
  }
}
