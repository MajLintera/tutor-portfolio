(function(){
  const carousel = document.getElementById('tutorPricingCarousel');
  const cards = carousel.querySelectorAll('.tutor-pricing-card');
  let current = 0;
  function isDesktop() {
    return window.innerWidth > 900;
  }
  function updateCards(dir) {
    if (!isDesktop()) {
      cards.forEach(c => {
        c.classList.remove('tutor-center','tutor-left','tutor-right','tutor-hover');
        c.style.position = '';
        c.style.left = '';
        c.style.top = '';
        c.style.transform = '';
        c.style.right = '';
        c.style.bottom = '';
      });
      return;
    }
    if (typeof dir === "number") {
      current = (current + dir + 3) % 3;
    }
    cards.forEach(c => c.classList.remove('tutor-center','tutor-left','tutor-right'));
    const left = (current + 2) % 3;
    const center = current;
    const right = (current + 1) % 3;
    cards[left].classList.add('tutor-left');
    cards[center].classList.add('tutor-center');
    cards[right].classList.add('tutor-right');
  }
  cards.forEach((card, i) => {
    card.addEventListener('click', function(e){
      if (!isDesktop()) return;
      if(card.classList.contains('tutor-right')) updateCards(1);
      else if(card.classList.contains('tutor-left')) updateCards(-1);
    });
    card.addEventListener('mouseenter',function(){
      if (!isDesktop()) return;
      card.classList.add('tutor-hover');
    });
    card.addEventListener('mouseleave',function(){
      if (!isDesktop()) return;
      card.classList.remove('tutor-hover');
    });
  });
  window.addEventListener('resize', function(){updateCards()});
  window.addEventListener('DOMContentLoaded', function(){updateCards()});
  updateCards();
})();
// Booking Form Handler
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());
    const resp = await fetch('http://localhost:4000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const msg = document.getElementById('bookingMsg');
    if (resp.status === 201) {
      msg.textContent = "Booking confirmed!";
      bookingForm.reset();
    } else if (resp.status === 409) {
      msg.textContent = "Sorry, that slot is already booked.";
    } else {
      msg.textContent = "Error booking. Please try again.";
    }
  });
}
