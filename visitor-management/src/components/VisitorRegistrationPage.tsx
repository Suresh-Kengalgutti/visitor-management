import React, { useState, ChangeEvent, FormEvent, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import './VisitorRegistrationPage.css'; // We will create this CSS file

// Define the shape of the form data
interface VisitorFormData {
  name: string;
  email: string;
  phone: string;
  photo: File | null; // We will store the captured photo as a File
  purpose: string;
  contactPerson: string;
  dateTime: string; // To store date and time
  additionalComments: string;
}

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: 'user', // 'user' for front camera, 'environment' for rear camera
};

const VisitorRegistrationPage: React.FC = () => {
  // Initialize form state
  const [formData, setFormData] = useState<VisitorFormData>({
    name: '',
    email: '',
    phone: '',
    photo: null,
    purpose: '',
    contactPerson: '',
    dateTime: '',
    additionalComments: '',
  });

  // State to manage webcam visibility and captured image
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // To display the captured image preview

  // Ref for the webcam component
  const webcamRef = useRef<Webcam>(null);

  // Handle input changes for text fields, including the new ones
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Activate the camera
  const activateCamera = () => {
    setIsCameraActive(true);
    setCapturedImage(null); // Clear any previous captured image
    setFormData({ ...formData, photo: null }); // Clear the photo from form data
  };

  // Capture photo from webcam
  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setIsCameraActive(false); // Deactivate camera after capturing

        // Convert base64 to Blob/File and update form data
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'visitor_photo.jpg', { type: 'image/jpeg' });
            setFormData(prevState => ({ ...prevState, photo: file }));
          })
          .catch(error => {
            console.error('Error converting blob to file:', error);
            // Handle error, maybe clear the captured image state
            setCapturedImage(null);
          });
      }
    }
  }, [webcamRef]); // formData is not needed as we use functional update for setFormData

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the formData to your backend.
    // The formData.photo will be a File object containing the captured image.
    console.log('Form Data Submitted:', formData);

    // Example of how you might send the data using FormData (for files)
    // const data = new FormData();
    // data.append('name', formData.name);
    // data.append('email', formData.email);
    // data.append('phone', formData.phone);
    // if (formData.photo) {
    //   data.append('photo', formData.photo);
    // }
    // data.append('purpose', formData.purpose);
    // data.append('contactPerson', formData.contactPerson);
    // data.append('dateTime', formData.dateTime);
    // data.append('additionalComments', formData.additionalComments);

    // fetch('/api/register-visitor', {
    //   method: 'POST',
    //   body: data,
    // })
    // .then(response => response.json())
    // .then(result => {
    //   console.log('Success:', result);
    //   // Handle success (e.g., show a success message, clear the form)
    // })
    // .catch(error => {
    //   console.error('Error:', error);
    //   // Handle errors
    // });

    // Reset the form after submission (optional)
    // setFormData({
    //   name: '',
    //   email: '',
    //   phone: '',
    //   photo: null,
    //   purpose: '',
    //   contactPerson: '',
    //   dateTime: '',
    //   additionalComments: '',
    // });
    // setCapturedImage(null);
    // setIsCameraActive(false);
  };

  return (
    <div className="visitor-page-container">
      <div className="left-section">
        {/* Replace with your logo */}
        <div className="logo">
          <img src="/path/to/your/logo.png" alt="Company Logo" />
        </div>
        <div className="marketing-content">
          <h1>Lorem ipsum</h1>
          <span>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem repellat vero explicabo sunt tempore enim vel hic distinctio, fuga accusamus voluptatibus porro placeat expedita natus qui, nulla illum temporibus. Deserunt.</span>
          {/* Replace with your social media icons */}
          <div className="social-icons">
            <img src="/path/to/twitter-icon.png" alt="Twitter" />
            <img src="/path/to/linkedin-icon.png" alt="LinkedIn" />
            <img src="/path/to/youtube-icon.png" alt="YouTube" />
            <img src="/path/to/instagram-icon.png" alt="Instagram" />
          </div>
          <p className="website-link">www.website.com</p>
        </div>
      </div>
      <div className="right-section">
        <div className="registration-form-container">
          <h2>OFFICE VISIT <span className='text-danger'>REQUEST</span></h2>
          <span>Please complete the form with all relevant information about your visit.</span>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Visitor Name <span className='text-danger'>*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter visitor name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address <span className='text-danger'>*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number <span className='text-danger'>*</span></label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="form-group from-group-4">
              <label>Visitor Photo <span className='text-danger'>*</span></label>
              <div className="photo-capture-section">
                {!isCameraActive && !capturedImage && (
                  <button type="button" className="capture-button" onClick={activateCamera}>
                    <img src="/path/to/camera-icon.png" alt="Capture Photo" />
                    <span>Capture Photo</span> {/* Text from screenshot */}
                  </button>
                )}

                {isCameraActive && (
                  <div className="webcam-container">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width={videoConstraints.width}
                      height={videoConstraints.height}
                      videoConstraints={videoConstraints}
                    />
                    <button type="button" onClick={capturePhoto}>
                      Capture Photo
                    </button>
                    {/* Optional: Button to cancel camera */}
                    {/* <button type="button" onClick={() => setIsCameraActive(false)}>Cancel Camera</button> */}
                  </div>
                )}

                {capturedImage && (
                  <div className="photo-preview">
                    <img src={capturedImage} alt="Captured Visitor" style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }} />
                    <button type="button" onClick={activateCamera}>
                      Retake Photo
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group form-group-6">
              <label htmlFor="purpose">Visit Purpose <span className='text-danger'>*</span></label>
              <select
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                required
              >
                <option value="">Select visit purpose <span className='text-danger'>*</span></option>
                {/* Add your purpose options here */}
                <option value="meeting">Meeting</option>
                <option value="interview">Interview</option>
                <option value="delivery">Delivery</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group form-group-6">
              <label htmlFor="contactPerson">Person You're Visiting <span className='text-danger'>*</span></label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="Enter person's name"
                required
              />
            </div>

            <div className="form-group form-group-6">
              <label htmlFor="dateTime">Date & Time of Visit <span className='text-danger'>*</span></label>
              {/* For a production app, consider a dedicated date/time picker library */}
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="additionalComments">Additional Notes</label>
              <textarea
                id="additionalComments"
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleInputChange}
                placeholder="Enter additional comments"
              />
            </div>

            <button type="submit" className="submit-button">
              SUBMIT REQUEST
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisitorRegistrationPage;