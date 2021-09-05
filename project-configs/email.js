import path from 'path';
import { articlize } from 'articles';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import { logger } from './logger';

const AWS = require('aws-sdk');

const { AWS_CONFIGRATION_SET_NAME } = process.env;
const SES = new AWS.SES({
  apiVersion: '2010-12-01'
});
// const { MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASS } = process.env;
// const transporter = nodemailer.createTransport({
//   host: MAIL_HOST,
//   port: MAIL_PORT,
//   secure: true,
//   auth: {
//     user: MAIL_USERNAME,
//     pass: MAIL_PASS
//   }
// });
const transporter = nodemailer.createTransport({
  SES
});
// const articlize = function(text) {
//   return Articles.articlize(text);
// };
const defaultOption = {
  ses: {
    ConfigurationSetName: AWS_CONFIGRATION_SET_NAME
  }
};

const sendMail = (option, templatePath, viewData, callback) => {
  templatePath = `${path.join(__dirname, '..', templatePath)}`;
  viewData.articlize = articlize;
  const newOption = { ...defaultOption, ...option };
  // console.log(newOption);
  ejs.renderFile(templatePath, viewData, function(err, str) {
    const html = str;
    newOption.html = html;
    transporter.sendMail(newOption, callback);
    if (err) {
      logger.error(err);
    }
  });
};

export { transporter, sendMail };
