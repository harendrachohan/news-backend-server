const STATE_KEYWORDS = {
  maharashtra: ['mumbai', 'maharashtra', 'pune', 'nagpur', 'thane'],
  delhi: ['delhi', 'new delhi', 'ncr'],
  karnataka: ['bangalore', 'bengaluru', 'karnataka', 'mysore', 'mysuru'],
  'tamil-nadu': ['chennai', 'tamil nadu', 'coimbatore', 'madurai'],
  'uttar-pradesh': ['lucknow', 'uttar pradesh', 'up ', ' noida', 'ghaziabad', 'agra', 'varanasi'],
  'west-bengal': ['kolkata', 'west bengal', 'darjeeling'],
  gujarat: ['gujarat', 'ahmedabad', 'surat', 'vadodara', 'gandhinagar'],
  rajasthan: ['rajasthan', 'jaipur', 'jodhpur', 'udaipur'],
  kerala: ['kerala', 'kochi', 'thiruvananthapuram', 'kozhikode'],
  telangana: ['telangana', 'hyderabad', 'secunderabad'],
  'andhra-pradesh': ['andhra pradesh', 'vijayawada', 'visakhapatnam', 'amaravati'],
  punjab: ['punjab', 'chandigarh', 'amritsar', 'ludhiana'],
  bihar: ['bihar', 'patna'],
  odisha: ['odisha', 'bhubaneswar'],
  assam: ['assam', 'guwahati'],
};

function detectState(title, content, sourceState) {
  if (sourceState) return sourceState;

  const text = `${title} ${content}`.toLowerCase();

  for (const [state, keywords] of Object.entries(STATE_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return state;
    }
  }

  return null;
}

module.exports = { detectState, STATE_KEYWORDS };
