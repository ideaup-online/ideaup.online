import React from 'react';
import styled from 'styled-components';
import {
  Field,
  DoubleField,
  DropDownSelectField,
  Button,
} from './fancy-fields';
import SmartQuote from './smart-quote';

//
// Container style
//

const Container = styled.div`
  display: grid;
  padding: 1em;
  background: #202020;
  border-radius: 0.5em;
`;

const LeftColumn = styled.div`
  grid-column: 1 / auto;
  display: flex;
  flex-direction: column;
`;

const RightColumn = styled.div`
  grid-column: 2 / auto;
  display: flex;
  flex-direction: column;
`;

const ColumnHeading = styled.div`
  color: coral;
  text-align: center;
  padding-top: 0.5em;
`;

const CenteredHeading = styled(ColumnHeading)`
  grid-column: 1 / span 2;
  font-size: 1.25em;
  font-weight: 400;
`;

const PaddedCenteredHeading = styled(CenteredHeading)`
  padding-top: 1em;
`;

class NoTrailCalculator extends React.Component {
  constructor(props) {
    super(props);

    // The number of seconds in a sidereal day
    // (Earth's rotation period relative to the
    // fixed stars). This number is according
    // to the International Earth Rotation and
    // Reference Systems Service (IERS)
    const siderealDaySecs = 86164.098903691;

    this.popularSensorTypes = [
      { type: 'Full Frame', width: 36, height: 24 },
      { type: 'APS-C', width: 24, height: 16 },
      { type: 'APS-C (Canon)', width: 22.2, height: 14.8 },
      { type: 'Micro 4/3', width: 17.3, height: 13 },
    ];

    // Calculate Earth's rotational speed in arcsec/sec
    this.earthAngularSpeedArcsecPerSec = (360 * 3600) / siderealDaySecs;

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendToCalcClicked = this.sendToCalcClicked.bind(this);
    this.calculateAndUpdate = this.calculateAndUpdate.bind(this);
  }

  handleFocus(e) {}

  handleBlur(e) {}

  handleChange(e) {
    this.calculateAndUpdate();
  }

  sendToCalcClicked() {
    document.getElementById('sensor-width-mm').value = document.getElementById(
      'popular-sensor-width-mm',
    ).value;
    document.getElementById('sensor-height-mm').value = document.getElementById(
      'popular-sensor-height-mm',
    ).value;
    this.calculateAndUpdate();
  }

  calculateAndUpdate() {
    // Constants
    const fullFrameWidth_mm = 36;
    const fullFrameHeight_mm = 24;

    // Get the current values
    const focalLen = document.getElementById('focal-length-mm').value;
    const sensorWidth_mm = document.getElementById('sensor-width-mm').value;
    const sensorHeight_mm = document.getElementById('sensor-height-mm').value;
    const resolution_mp = document.getElementById(
      'pixel-density-megapix',
    ).value;
    const exposureTime_secs =
      document.getElementById('exposure-time-secs').value;
    const popularSensor_idx =
      document.getElementById('sensor-type').selectedIndex;

    // Do the math with the current values
    if (
      focalLen !== '' &&
      sensorWidth_mm !== '' &&
      sensorHeight_mm !== '' &&
      resolution_mp !== ''
    ) {
      // Convert resolution to pixels
      const resolution = resolution_mp * 1000000;

      // Determine sensor width in pixels
      // (sqrt(resolution * aspect_ratio))
      const sensorWidth_px = Math.sqrt(
        resolution * (sensorWidth_mm / sensorHeight_mm),
      );

      // Determine the sensor diagonal length in mm
      // (a squared + b squared = c squared)
      const sensorDiag_mm = Math.sqrt(
        sensorWidth_mm * sensorWidth_mm + sensorHeight_mm * sensorHeight_mm,
      );

      // Determine the diagonal length of full frame in mm
      const fullFrameDiag_mm = Math.sqrt(
        fullFrameWidth_mm * fullFrameWidth_mm +
          fullFrameHeight_mm * fullFrameHeight_mm,
      );

      // Crop factor is ratio of sensor diag to full frame diag
      const cropFactor = fullFrameDiag_mm / sensorDiag_mm;

      // Calculate pixel size in microns
      // (sensor_width_microns / sensor_width_pixels)
      const sensorPixelSizeMicrons = (sensorWidth_mm * 1000) / sensorWidth_px;

      // Calculate FOV for a single pixel in radians
      const sensorAngularResolutionRadians =
        2 * Math.atan(sensorPixelSizeMicrons / (2 * (focalLen * 1000)));

      // In degrees
      const sensorAngularResolutionDegrees =
        sensorAngularResolutionRadians * (180 / Math.PI);

      // And finally in arcseconds
      const sensorAngularResolutionArcsecs =
        sensorAngularResolutionDegrees * 3600;

      // Update fields
      document.getElementById('sensor-angular-resolution').value =
        sensorAngularResolutionArcsecs.toFixed(2);
      document.getElementById('sensor-pixel-size-microns').value =
        sensorPixelSizeMicrons.toFixed(2);
      const earthMotionPxPerSec =
        this.earthAngularSpeedArcsecPerSec / sensorAngularResolutionArcsecs;
      document.getElementById('earth-motion').value =
        earthMotionPxPerSec.toFixed(2);
      const seconds500Rule = 500 / (focalLen * cropFactor);
      document.getElementById('seconds-500-rule').value =
        seconds500Rule.toFixed(2);
      document.getElementById('pixels-moved').value = (
        exposureTime_secs * earthMotionPxPerSec
      ).toFixed(2);
      document.getElementById('pixels-moved-500-rule').value = (
        seconds500Rule * earthMotionPxPerSec
      ).toFixed(2);
    } else {
      // Clear fields
      document.getElementById('sensor-angular-resolution').value = '';
      document.getElementById('sensor-pixel-size-microns').value = '';
      document.getElementById('earth-motion').value = '';
      document.getElementById('seconds-500-rule').value = '';
      document.getElementById('pixels-moved').value = '';
      document.getElementById('pixels-moved-500-rule').value = '';
    }

    // Update popular sensor size
    document.getElementById('popular-sensor-width-mm').value =
      this.popularSensorTypes[popularSensor_idx].width;
    document.getElementById('popular-sensor-height-mm').value =
      this.popularSensorTypes[popularSensor_idx].height;
  }

  componentDidMount() {
    this.calculateAndUpdate();
  }

  render() {
    return (
      <div>
        <Container
          className={this.props.className || ''}
          id={this.props.id || ''}
        >
          <CenteredHeading>Untracked Star Motion Calculator</CenteredHeading>
          <LeftColumn>
            <ColumnHeading>You Supply These</ColumnHeading>
            <Field
              label="Focal Length:"
              decorator="mm"
              inputProps={{
                id: 'focal-length-mm',
                type: 'number',
                defaultValue: 14,
                onFocus: this.handleFocus,
                onBlur: this.handleBlur,
                onChange: this.handleChange,
              }}
            />
            <DoubleField
              label="Sensor Size:"
              decorator="mm"
              // decoratorPosition="left"
              middleDecorator="x"
              inputPropsLeft={{
                id: 'sensor-width-mm',
                type: 'number',
                defaultValue: 36,
                onFocus: this.handleFocus,
                onBlur: this.handleBlur,
                onChange: this.handleChange,
              }}
              inputPropsRight={{
                id: 'sensor-height-mm',
                type: 'number',
                defaultValue: 24,
                onFocus: this.handleFocus,
                onBlur: this.handleBlur,
                onChange: this.handleChange,
              }}
            />
            <Field
              label="Resolution:"
              decorator="mp"
              inputProps={{
                id: 'pixel-density-megapix',
                type: 'number',
                defaultValue: 24.3,
                onFocus: this.handleFocus,
                onBlur: this.handleBlur,
                onChange: this.handleChange,
              }}
            />
            <Field
              label="Exposure Time:"
              decorator="sec"
              inputProps={{
                id: 'exposure-time-secs',
                type: 'number',
                defaultValue: 20,
                onFocus: this.handleFocus,
                onBlur: this.handleBlur,
                onChange: this.handleChange,
              }}
            />
          </LeftColumn>
          <RightColumn>
            <ColumnHeading>
              <SmartQuote>{"We'll Calculate These"}</SmartQuote>
            </ColumnHeading>
            <Field
              label="Sensor Pixel Size:"
              decorator="μm"
              inputProps={{
                id: 'sensor-pixel-size-microns',
                type: 'text',
                readOnly: true,
              }}
            />
            <Field
              label="Sensor Angular Resolution:"
              decorator="arcsec/px"
              inputProps={{
                id: 'sensor-angular-resolution',
                type: 'text',
                readOnly: true,
              }}
            />
            <Field
              label="Sensor Apparent Motion:"
              decorator="px/sec"
              inputProps={{
                id: 'earth-motion',
                type: 'text',
                readOnly: true,
              }}
            />
            <Field
              label="Exposure Pixels Moved:"
              decorator="px"
              inputProps={{
                id: 'pixels-moved',
                type: 'text',
                readOnly: true,
              }}
            />
          </RightColumn>
          <PaddedCenteredHeading>Popular Sensor Types</PaddedCenteredHeading>
          <LeftColumn>
            <DropDownSelectField
              label="Sensor Type:"
              inputProps={{
                id: 'sensor-type',
                onFocus: this.handleFocus,
                onBlur: this.handleBlur,
                onChange: this.handleChange,
                items: this.popularSensorTypes.map((item) => {
                  return item.type;
                }),
              }}
            />
          </LeftColumn>
          <RightColumn>
            <DoubleField
              label="Sensor Size:"
              decorator="mm"
              middleDecorator="x"
              inputPropsLeft={{
                id: 'popular-sensor-width-mm',
                type: 'text',
                readOnly: true,
              }}
              inputPropsRight={{
                id: 'popular-sensor-height-mm',
                type: 'text',
                readOnly: true,
              }}
            />
            <Button id="send-to-calc-button" onClick={this.sendToCalcClicked}>
              Send to Calculator
            </Button>
          </RightColumn>
          <PaddedCenteredHeading>
            500 Rule Guideline (for Comparison)
          </PaddedCenteredHeading>
          <LeftColumn>
            {' '}
            <Field
              label="500 Rule Exposure Time:"
              decorator="sec"
              inputProps={{
                id: 'seconds-500-rule',
                type: 'text',
                readOnly: true,
              }}
            />
          </LeftColumn>
          <RightColumn>
            {' '}
            <Field
              label="500 Rule Pixels Moved:"
              decorator="px"
              inputProps={{
                id: 'pixels-moved-500-rule',
                type: 'text',
                readOnly: true,
              }}
            />
          </RightColumn>
        </Container>
      </div>
    );
  }
}

export default NoTrailCalculator;
