import React from "react";

const About = () => {
  return (
    <div className="container padding">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center mb-4">Welcome to Our Music Portal</h2>
          <div className="row my-4">
            <div className="col-md-6">
              <div className="card hoverable-card mb-4">
                <div className="card-body">
                  <h4>Discover New Music</h4>
                  <p>
                    Dive into a vast collection of songs spanning multiple
                    genres and discover your new favorite tracks.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card hoverable-card mb-4">
                <div className="card-body">
                  <h4>Express Yourself</h4>
                  <p>
                    Share your thoughts on songs, leave comments, and engage
                    with other music enthusiasts in our vibrant community.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row my-4">
            <div className="col-md-6">
              <div className="card hoverable-card mb-4">
                <div className="card-body">
                  <h4>Stay Updated</h4>
                  <p>
                    Stay informed about the latest trends and popular songs with
                    our trending section.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card hoverable-card mb-4">
                <div className="card-body">
                  <h4>Personalize Your Experience</h4>
                  <p>
                    Create your own profile, share songs you love and connect
                    with other people.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row my-4">
            <div className="col-md-12">
              <div className="card hoverable-card">
                <div className="card-body">
                  <h4>Our Mission</h4>
                  <p>
                    Our mission is to provide music lovers with a seamless and
                    enjoyable platform to explore, share, and connect through
                    the power of music.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
