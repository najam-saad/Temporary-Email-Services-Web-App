export const trackPageView = () => {
  // Implement basic analytics
  if (typeof window !== 'undefined') {
    localStorage.setItem('pageViews', 
      String(Number(localStorage.getItem('pageViews') || 0) + 1)
    );
  }
};

export const getPageViews = () => {
  if (typeof window !== 'undefined') {
    return Number(localStorage.getItem('pageViews') || 0);
  }
  return 0;
}; 