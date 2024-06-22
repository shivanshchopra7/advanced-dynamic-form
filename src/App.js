import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'; 
// Custom hook for form validation
const useForm = (callback) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      callback(values);
    }
  };

  const validate = (values) => {
    let errors = {};
    // Validation rules
    if (!values.fullName) {
      errors.fullName = "Full Name is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }
    if (!values.surveyTopic) {
      errors.surveyTopic = "Survey Topic is required";
    }
    if (values.surveyTopic === "Technology") {
      if (!values.favoriteLanguage) {
        errors.favoriteLanguage = "Favorite Programming Language is required";
      }
      if (!values.yearsOfExperience) {
        errors.yearsOfExperience = "Years of Experience is required";
      }
    } else if (values.surveyTopic === "Health") {
      if (!values.exerciseFrequency) {
        errors.exerciseFrequency = "Exercise Frequency is required";
      }
      if (!values.dietPreference) {
        errors.dietPreference = "Diet Preference is required";
      }
    } else if (values.surveyTopic === "Education") {
      if (!values.highestQualification) {
        errors.highestQualification = "Highest Qualification is required";
      }
      if (!values.fieldOfStudy) {
        errors.fieldOfStudy = "Field of Study is required";
      }
    }
    if (!values.feedback || values.feedback.length < 50) {
      errors.feedback = "Feedback is required and must be at least 50 characters";
    }
    return errors;
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors
  };
};

const SurveyForm = () => {
  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [submittedData, setSubmittedData] = useState(null); // State to hold submitted data
  const { handleChange, handleSubmit, values, errors } = useForm(submitForm);

  // Define submitForm function after useForm
  function submitForm(values) {
    // Simulate form submission or integrate with API
    console.log('Form submitted:', values);
    setSubmittedData(values); // Update state with submitted data
  }

  useEffect(() => {
    if (values.surveyTopic) {
      fetchAdditionalQuestions(values.surveyTopic);
    }
  }, [values.surveyTopic]);

  const fetchAdditionalQuestions = async (topic) => {
    try {
      const response = await axios.get(`api/questions/${topic}`);
      setAdditionalQuestions(response.data);
    } catch (error) {
      console.error('Error fetching additional questions:', error);
    }
  };

  return (
    <div className='container'>
      {!submittedData ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName">Full Name:</label>
            <input type="text" id="fullName" name="fullName" onChange={handleChange} />
            {errors.fullName && <span>{errors.fullName}</span>}
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" onChange={handleChange} />
            {errors.email && <span>{errors.email}</span>}
          </div>
          <div>
            <label htmlFor="surveyTopic">Survey Topic:</label>
            <select id="surveyTopic" name="surveyTopic" onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
            </select>
            {errors.surveyTopic && <span>{errors.surveyTopic}</span>}
          </div>

          {values.surveyTopic === "Technology" && (
            <div>
              <label htmlFor="favoriteLanguage">Favorite Programming Language:</label>
              <select id="favoriteLanguage" name="favoriteLanguage" onChange={handleChange}>
                <option value="">Select...</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C#">C#</option>
              </select>
              {errors.favoriteLanguage && <span>{errors.favoriteLanguage}</span>}
              <label htmlFor="yearsOfExperience">Years of Experience:</label>
              <input type="number" id="yearsOfExperience" name="yearsOfExperience" onChange={handleChange} />
              {errors.yearsOfExperience && <span>{errors.yearsOfExperience}</span>}
            </div>
          )}

          {values.surveyTopic === "Health" && (
            <div>
              <label htmlFor="exerciseFrequency">Exercise Frequency:</label>
              <select id="exerciseFrequency" name="exerciseFrequency" onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Rarely">Rarely</option>
              </select>
              {errors.exerciseFrequency && <span>{errors.exerciseFrequency}</span>}
              <label htmlFor="dietPreference">Diet Preference:</label>
              <select id="dietPreference" name="dietPreference" onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
              {errors.dietPreference && <span>{errors.dietPreference}</span>}
            </div>
          )}

          {values.surveyTopic === "Education" && (
            <div>
              <label htmlFor="highestQualification">Highest Qualification:</label>
              <select id="highestQualification" name="highestQualification" onChange={handleChange}>
                <option value="">Select...</option>
                <option value="High School">High School</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
              </select>
              {errors.highestQualification && <span>{errors.highestQualification}</span>}
              <label htmlFor="fieldOfStudy">Field of Study:</label>
              <input type="text" id="fieldOfStudy" name="fieldOfStudy" onChange={handleChange} />
              {errors.fieldOfStudy && <span>{errors.fieldOfStudy}</span>}
            </div>
          )}

          <div>
            <label htmlFor="feedback">Feedback:</label>
            <textarea id="feedback" name="feedback" onChange={handleChange}></textarea>
            {errors.feedback && <span>{errors.feedback}</span>}
          </div>

          <button type="submit">Submit</button>
        </form>
      ) : (
        <div>
          <h2>Submitted Data:</h2>
          <p><strong>Full Name:</strong> {submittedData.fullName}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
          <p><strong>Survey Topic:</strong> {submittedData.surveyTopic}</p>
          {submittedData.surveyTopic === "Technology" && (
            <div>
              <p><strong>Favorite Programming Language:</strong> {submittedData.favoriteLanguage}</p>
              <p><strong>Years of Experience:</strong> {submittedData.yearsOfExperience}</p>
            </div>
          )}
          {submittedData.surveyTopic === "Health" && (
            <div>
              <p><strong>Exercise Frequency:</strong> {submittedData.exerciseFrequency}</p>
              <p><strong>Diet Preference:</strong> {submittedData.dietPreference}</p>
            </div>
          )}
          {submittedData.surveyTopic === "Education" && (
            <div>
              <p><strong>Highest Qualification:</strong> {submittedData.highestQualification}</p>
              <p><strong>Field of Study:</strong> {submittedData.fieldOfStudy}</p>
            </div>
          )}
          <p><strong>Feedback:</strong> {submittedData.feedback}</p>
        </div>
      )}
    </div>
  );
};

export default SurveyForm;
