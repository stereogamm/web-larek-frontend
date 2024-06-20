export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const options = {
    headers: {
        'authorization': `${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
    },
}

export const colorSetting = {
      'софт-скил': 'soft',
      'другое': 'other',
      'дополнительное': 'additional',
      'кнопка': 'button',
      'хард-скил': 'hard'
};
