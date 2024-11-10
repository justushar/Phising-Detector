# Phishing Detection Chrome Extension

This Chrome Extension uses Roberta (a transformer-based language model) and TensorFlow.js (tfjs) to detect phishing and spam emails on Gmail. By analyzing email content, the extension flags suspicious messages, helping users avoid falling victim to phishing attacks.

## Features

- **Real-time Email Analysis:** Automatically scans incoming Gmail messages to detect phishing and spam content.
- **Roberta Model Integration:** Uses the pre-trained Roberta model for text classification to detect malicious emails.
- **TensorFlow.js:** Leverages TensorFlow.js for running the phishing detection model directly in the browser, ensuring fast and efficient performance without sending data to external servers.
- **User-Friendly Alerts:** Flags suspicious emails and displays warnings within Gmail’s interface to alert users about potential phishing attempts.

## Installation

1. **Clone the repository** to your local machine:
    ```bash
    git clone https://github.com/justushar/Phising-Detector.git
    ```

2. **Open Chrome** and go to the `chrome://extensions/` page.

3. **Enable Developer Mode** by toggling the switch in the top-right corner.

4. Click on the **Load unpacked** button and select the folder where you cloned the repository.

5. The extension will now be installed and active. You should see the phishing detection icon in your browser's toolbar.

## How It Works

1. **Email Detection:** The extension listens for incoming Gmail messages using the Gmail API. When a new message is received, it extracts the email content, including the subject and body.

2. **Phishing Detection:** The extracted text is passed through the Roberta model for classification. The model has been fine-tuned on a dataset of spam and phishing emails, allowing it to identify potential phishing attempts.

3. **TensorFlow.js Inference:** TensorFlow.js runs the model locally within the browser, ensuring that the email content is never sent to external servers for analysis, preserving user privacy.

4. **Alerting the User:** If the model identifies the email as phishing or spam, the extension flags it with a warning in Gmail’s UI, making it easy for the user to take action.

## Technologies Used

- **TensorFlow.js:** A library for running machine learning models directly in the browser.
- **Roberta:** A transformer-based model fine-tuned for text classification tasks, used for detecting phishing and spam emails.
- **Chrome Extension API:** For interacting with Gmail and injecting functionality directly into the browser.
- **Gmail API:** For accessing and reading the user's emails securely.

## Usage

- Once installed, the extension will automatically start analyzing incoming Gmail messages.
- If an email is flagged as phishing or spam, a warning icon will appear next to the email subject.
- Users can click the warning icon for more details or take immediate actions such as deleting or reporting the email.

## Privacy

The extension runs completely in the browser, and no email content is sent to external servers for analysis. Your data is processed locally using TensorFlow.js and Roberta, ensuring your privacy is maintained.

## Contributing

We welcome contributions! If you would like to contribute to the development of this extension, please fork the repository, create a new branch, and submit a pull request.

### Steps to contribute:
1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Implement your changes.
4. Ensure all tests are passing and the extension works correctly.
5. Submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Hugging Face** for providing the Roberta model.
- **Google TensorFlow** for providing the TensorFlow.js library.
- **Google Chrome Extensions API** for enabling us to create this extension.

