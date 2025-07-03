// Time type definitions for trigger scheduling
export const TIME_TYPES = {
  EARLY_MORNING: 'early_morning',
  MORNING: 'morning',
  EARLY_AFTERNOON: 'early_afternoon',
  AFTERNOON: 'afternoon',
  EARLY_EVENING: 'early_evening',
  EVENING: 'evening',
  EARLY_NIGHT: 'early_night',
  NIGHT: 'night'
};

// Time ranges for each time type
export const TIME_RANGES = {
  [TIME_TYPES.EARLY_MORNING]: { start: '06:00', end: '09:00', label: 'Early Morning' },
  [TIME_TYPES.MORNING]: { start: '09:00', end: '12:00', label: 'Morning' },
  [TIME_TYPES.EARLY_AFTERNOON]: { start: '12:00', end: '15:00', label: 'Early Afternoon' },
  [TIME_TYPES.AFTERNOON]: { start: '15:00', end: '18:00', label: 'Afternoon' },
  [TIME_TYPES.EARLY_EVENING]: { start: '18:00', end: '21:00', label: 'Early Evening' },
  [TIME_TYPES.EVENING]: { start: '21:00', end: '00:00', label: 'Evening' },
  [TIME_TYPES.EARLY_NIGHT]: { start: '00:00', end: '03:00', label: 'Early Night' },
  [TIME_TYPES.NIGHT]: { start: '03:00', end: '06:00', label: 'Night' }
};

// Days of the week
export const DAYS_OF_WEEK = [
    { name: 'Sunday', short: 'Sun', index: 0 },
  { name: 'Monday', short: 'Mon', index: 1 },
  { name: 'Tuesday', short: 'Tue', index: 2 },
  { name: 'Wednesday', short: 'Wed', index: 3 },
  { name: 'Thursday', short: 'Thu', index: 4 },
  { name: 'Friday', short: 'Fri', index: 5 },
  { name: 'Saturday', short: 'Sat', index: 6 },
];

/**
 * Convert time string to minutes for comparison
 * @param {string} time - Time in HH:MM or HH:MM:SS format
 * @returns {number} - Minutes since midnight
 */
export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Determine time type based on the given time
 * @param {string} time - Time in HH:MM or HH:MM:SS format
 * @returns {string} - Time type constant
 */
export const getTimeTypeFromTime = (time) => {
  const timeMinutes = timeToMinutes(time);
  
  // Handle midnight edge case
  if (timeMinutes === 0) {
    return TIME_TYPES.EARLY_NIGHT;
  }
  
  // Check each time range
  for (const [timeType, range] of Object.entries(TIME_RANGES)) {
    const startMinutes = timeToMinutes(range.start);
    let endMinutes = timeToMinutes(range.end);
    
    // Handle midnight crossing for evening
    if (timeType === TIME_TYPES.EVENING) {
      endMinutes = 24 * 60; // 24:00 in minutes
    }
    
    // Handle early night (midnight to 3am)
    if (timeType === TIME_TYPES.EARLY_NIGHT) {
      if (timeMinutes >= 0 && timeMinutes < timeToMinutes(range.end)) {
        return timeType;
      }
    }
    // Handle evening (9pm to midnight)
    else if (timeType === TIME_TYPES.EVENING) {
      if (timeMinutes >= startMinutes || timeMinutes === 0) {
        return timeType;
      }
    }
    // Handle all other time ranges
    else if (timeMinutes >= startMinutes && timeMinutes < endMinutes) {
      return timeType;
    }
  }
  
  return TIME_TYPES.MORNING; // Default fallback
};

/**
 * Format time type for display
 * @param {string} timeType - Time type constant
 * @returns {string} - Formatted time type label
 */
export const formatTimeType = (timeType) => {
  return TIME_RANGES[timeType]?.label || 'Unknown';
};

/**
 * Get color class for time type (for UI styling)
 * @param {string} timeType - Time type constant
 * @returns {string} - CSS color class
 */
export const getTimeTypeColor = (timeType) => {
  const colorMap = {
    [TIME_TYPES.EARLY_MORNING]: 'text-orange-500',
    [TIME_TYPES.MORNING]: 'text-yellow-500',
    [TIME_TYPES.EARLY_AFTERNOON]: 'text-green-500',
    [TIME_TYPES.AFTERNOON]: 'text-blue-500',
    [TIME_TYPES.EARLY_EVENING]: 'text-purple-500',
    [TIME_TYPES.EVENING]: 'text-indigo-500',
    [TIME_TYPES.EARLY_NIGHT]: 'text-gray-500',
    [TIME_TYPES.NIGHT]: 'text-gray-700'
  };
  
  return colorMap[timeType] || 'text-gray-500';
};

/**
 * Get background color class for time type
 * @param {string} timeType - Time type constant
 * @returns {string} - CSS background color class
 */
export const getTimeTypeBackground = (timeType) => {
  const backgroundMap = {
    [TIME_TYPES.EARLY_MORNING]: 'bg-orange-100',
    [TIME_TYPES.MORNING]: 'bg-yellow-100',
    [TIME_TYPES.EARLY_AFTERNOON]: 'bg-green-100',
    [TIME_TYPES.AFTERNOON]: 'bg-blue-100',
    [TIME_TYPES.EARLY_EVENING]: 'bg-purple-100',
    [TIME_TYPES.EVENING]: 'bg-indigo-100',
    [TIME_TYPES.EARLY_NIGHT]: 'bg-gray-100',
    [TIME_TYPES.NIGHT]: 'bg-gray-200'
  };
  
  return backgroundMap[timeType] || 'bg-gray-100';
};

/**
 * Format days array for display
 * @param {number[]} days - Array of day indices (0 = Monday, 6 = Sunday)
 * @returns {string} - Formatted days string
 */
export const formatSelectedDays = (days) => {
  if (!days || days.length === 0) {
    return 'No days selected';
  }
  
  if (days.length === 7) {
    return 'Every day';
  }
  
  if (days.length === 5 && !days.includes(5) && !days.includes(6)) {
    return 'Weekdays';
  }
  
  if (days.length === 2 && days.includes(5) && days.includes(6)) {
    return 'Weekends';
  }
  
  const dayNames = days
    .sort()
    .map(dayIndex => DAYS_OF_WEEK[dayIndex]?.short)
    .filter(Boolean);
    
  return dayNames.join(', ');
};

/**
 * Validate trigger form data
 * @param {Object} triggerData - Trigger form data
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateTriggerForm = (triggerData) => {
  const errors = {};
  let isValid = true;
  
  // Validate workflow ID
  if (!triggerData.wf_id) {
    errors.wf_id = 'Please select a workflow';
    isValid = false;
  }
  
  // Validate schedule type
  if (!triggerData.schedule_type) {
    errors.schedule_type = 'Please select a schedule type';
    isValid = false;
  }
  
  // Validate days for weekly schedule
  if (triggerData.schedule_type === 'weekly') {
    if (!triggerData.days || triggerData.days.length === 0) {
      errors.days = 'Please select at least one day';
      isValid = false;
    }
  }
  
  // Validate time
  if (!triggerData.time) {
    errors.time = 'Please select a time';
    isValid = false;
  } else {
    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    if (!timeRegex.test(triggerData.time)) {
      errors.time = 'Please enter a valid time format (HH:MM)';
      isValid = false;
    }
  }
  
  return { isValid, errors };
};

/**
 * Generate cron expression from trigger data
 * @param {Object} triggerData - Trigger form data
 * @returns {string} - Cron expression
 */
export const generateCronExpression = (triggerData) => {
  if (!triggerData.time || !triggerData.days) {
    return '';
  }
  
  const [hours, minutes] = triggerData.time.split(':');
  const daysOfWeek = triggerData.days.map(day => (day + 1) % 7).join(','); // Convert to cron format (0 = Sunday)
  
  return `${minutes} ${hours} * * ${daysOfWeek}`;
};

/**
 * Parse cron expression to trigger data
 * @param {string} cronExpression - Cron expression
 * @returns {Object} - Parsed trigger data
 */
export const parseCronExpression = (cronExpression) => {
  try {
    const parts = cronExpression.split(' ');
    if (parts.length < 5) {
      return null;
    }
    
    const [minutes, hours, , , daysOfWeek] = parts;
    
    // Convert time
    const time = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    
    // Convert days (cron format to our format)
    const days = daysOfWeek.split(',')
      .map(day => parseInt(day))
      .map(day => day === 0 ? 6 : day - 1) // Convert from cron format (0 = Sunday) to our format (6 = Sunday)
      .sort();
    
    return {
      time,
      days,
      schedule_type: 'weekly'
    };
  } catch (error) {
    console.error('Error parsing cron expression:', error);
    return null;
  }
};

/**
 * Get next execution time for a trigger
 * @param {Object} triggerData - Trigger form data
 * @returns {Date|null} - Next execution date
 */
export const getNextExecutionTime = (triggerData) => {
  if (!triggerData.time || !triggerData.days || triggerData.days.length === 0) {
    return null;
  }
  
  const now = new Date();
  const [hours, minutes] = triggerData.time.split(':').map(Number);
  
  // Find the next occurrence
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(now.getDate() + i);
    checkDate.setHours(hours, minutes, 0, 0);
    
    const dayOfWeek = (checkDate.getDay() + 6) % 7; // Convert to our format (0 = Monday)
    
    if (triggerData.days.includes(dayOfWeek) && checkDate > now) {
      return checkDate;
    }
  }
  
  return null;
};

/**
 * Format execution time for display
 * @param {Date} date - Execution date
 * @returns {string} - Formatted execution time
 */
export const formatExecutionTime = (date) => {
  if (!date) return 'Not scheduled';
  
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
  
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (isToday) {
    return `Today at ${timeStr}`;
  } else if (isTomorrow) {
    return `Tomorrow at ${timeStr}`;
  } else {
    return `${date.toLocaleDateString()} at ${timeStr}`;
  }
};

/**
 * Get trigger status based on current time and settings
 * @param {Object} triggerData - Trigger form data
 * @returns {Object} - Status object with type and message
 */
export const getTriggerStatus = (triggerData) => {
  if (!triggerData.wf_id) {
    return { type: 'inactive', message: 'No workflow selected' };
  }
  
  if (!triggerData.days || triggerData.days.length === 0) {
    return { type: 'inactive', message: 'No days selected' };
  }
  
  if (!triggerData.time) {
    return { type: 'inactive', message: 'No time set' };
  }
  
  const nextExecution = getNextExecutionTime(triggerData);
  if (!nextExecution) {
    return { type: 'inactive', message: 'No upcoming executions' };
  }
  
  const now = new Date();
  const hoursUntilNext = (nextExecution - now) / (1000 * 60 * 60);
  
  if (hoursUntilNext < 1) {
    return { type: 'imminent', message: 'Executing soon' };
  } else if (hoursUntilNext < 24) {
    return { type: 'today', message: 'Executing today' };
  } else {
    return { type: 'scheduled', message: 'Scheduled' };
  }
};

/**
 * Get status color for trigger status
 * @param {string} statusType - Status type
 * @returns {string} - CSS color class
 */
export const getStatusColor = (statusType) => {
  const colorMap = {
    'inactive': 'text-red-500',
    'imminent': 'text-orange-500',
    'today': 'text-blue-500',
    'scheduled': 'text-green-500'
  };
  
  return colorMap[statusType] || 'text-gray-500';
};

/**
 * Get status background color for trigger status
 * @param {string} statusType - Status type
 * @returns {string} - CSS background color class
 */
export const getStatusBackground = (statusType) => {
  const backgroundMap = {
    'inactive': 'bg-red-100',
    'imminent': 'bg-orange-100',
    'today': 'bg-blue-100',
    'scheduled': 'bg-green-100'
  };
  
  return backgroundMap[statusType] || 'bg-gray-100';
};

/**
 * Convert 24-hour time to 12-hour format
 * @param {string} time24 - Time in 24-hour format (HH:MM or HH:MM:SS)
 * @returns {string} - Time in 12-hour format
 */
export const convertTo12Hour = (time24) => {
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Convert 12-hour time to 24-hour format
 * @param {string} time12 - Time in 12-hour format
 * @returns {string} - Time in 24-hour format
 */
export const convertTo24Hour = (time12) => {
  if (!time12) return '';
  
  const [time, period] = time12.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let hours24 = hours;
  if (period === 'PM' && hours !== 12) {
    hours24 += 12;
  } else if (period === 'AM' && hours === 12) {
    hours24 = 0;
  }
  
  return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
};

/**
 * Get recommended time slots for each time type
 * @param {string} timeType - Time type constant
 * @returns {string[]} - Array of recommended time slots
 */
export const getRecommendedTimeSlots = (timeType) => {
  const slots = {
    [TIME_TYPES.EARLY_MORNING]: ['06:00', '07:00', '08:00'],
    [TIME_TYPES.MORNING]: ['09:00', '10:00', '11:00'],
    [TIME_TYPES.EARLY_AFTERNOON]: ['12:00', '13:00', '14:00'],
    [TIME_TYPES.AFTERNOON]: ['15:00', '16:00', '17:00'],
    [TIME_TYPES.EARLY_EVENING]: ['18:00', '19:00', '20:00'],
    [TIME_TYPES.EVENING]: ['21:00', '22:00', '23:00'],
    [TIME_TYPES.EARLY_NIGHT]: ['00:00', '01:00', '02:00'],
    [TIME_TYPES.NIGHT]: ['03:00', '04:00', '05:00']
  };
  
  return slots[timeType] || [];
};

/**
 * Check if a trigger overlaps with system maintenance windows
 * @param {Object} triggerData - Trigger form data
 * @returns {boolean} - True if overlaps with maintenance
 */
export const hasMaintenanceConflict = (triggerData) => {
  // Define maintenance windows (typically early morning hours)
  const maintenanceWindows = [
    { start: '02:00', end: '03:00', days: [0, 1, 2, 3, 4, 5, 6] }, // Daily 2-3 AM
    { start: '05:00', end: '06:00', days: [6] } // Sunday 5-6 AM
  ];
  
  if (!triggerData.time || !triggerData.days) return false;
  
  const triggerMinutes = timeToMinutes(triggerData.time);
  
  return maintenanceWindows.some(window => {
    const startMinutes = timeToMinutes(window.start);
    const endMinutes = timeToMinutes(window.end);
    const hasOverlappingDays = triggerData.days.some(day => window.days.includes(day));
    
    return hasOverlappingDays && triggerMinutes >= startMinutes && triggerMinutes < endMinutes;
  });
};

/**
 * Get timezone offset in minutes
 * @returns {number} - Timezone offset in minutes
 */
export const getTimezoneOffset = () => {
  return new Date().getTimezoneOffset();
};

/**
 * Convert local time to UTC
 * @param {string} localTime - Local time string
 * @returns {string} - UTC time string
 */
export const convertToUTC = (localTime) => {
  if (!localTime) return '';
  
  const [hours, minutes] = localTime.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  
  return date.toISOString().substr(11, 8);
};

/**
 * Convert UTC time to local time
 * @param {string} utcTime - UTC time string
 * @returns {string} - Local time string
 */
export const convertFromUTC = (utcTime) => {
  if (!utcTime) return '';
  
  const [hours, minutes] = utcTime.split(':').map(Number);
  const date = new Date();
  date.setUTCHours(hours, minutes, 0, 0);
  
  return date.toTimeString().substr(0, 8);
};