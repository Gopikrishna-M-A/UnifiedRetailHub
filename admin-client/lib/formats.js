export function convertDateFormat(dateString) { // Output: "2024-08-12"
    const date = new Date(dateString);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

export function formatDate(date) { // Output: "August 12, 2024"
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

export function formatDateAndTime(inputDate) { // Output: "Aug 12 3:30 PM"
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dateObject = new Date(inputDate);

  const year = dateObject.getFullYear();
  const month = months[dateObject.getMonth()];
  const day = dateObject.getDate();
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();

  // Convert 24-hour time to 12-hour time with AM/PM
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  const formattedDate = `${month} ${day} ${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;

  return formattedDate;
}


  export function formatToINR(number) {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  
    return formatter.format(number);
  }

  export function getInitials(name) {
    return name.split(' ').map(word => word.charAt(0)).join('');
  }
  