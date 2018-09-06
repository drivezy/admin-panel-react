import React, { Component } from 'react';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption
  } from 'reactstrap';
import {Get} from "common-js-util";
import './blockVehicleImages.component.css';

export default class VehicleCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            activeIndex: 0 ,
        }
    }

    UNSAFE_componentWillReceiveProps (nextProps){
        let query = "?query=source='"+nextProps.data.source+"'&"+"source_id="+nextProps.data.source_id;
        this.getImages(query);
    }

    getImages = async (query) => {
        let url = "document"+query;
        const result = await Get({ url: url });
        if(result.success){
            this.setState({images: result.response});
        }
    }

    onExiting  = () => {
        this.animating = true;
      }
    
      onExited = () => {
        this.animating = false;
      }
    
      next = () => {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === this.state.images.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
      }
    
      previous = () => {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? this.state.images.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
      }
    
      goToIndex = (newIndex) => {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
      }
    

    render() {
        const { images, activeIndex } = this.state;
        const slides = images.length && images.map((item,key) => {
            return (
              <CarouselItem
                className="custom-tag"
                onExiting={this.onExiting}
                onExited={this.onExited}
                key={key}
              >
                <img src={item.document_link} alt="" />
                <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
              </CarouselItem>
            );
          });
        return (
            <div className="block-vehicle-omage">
                {
                    images.length ? 
                    (
                        <div>
                             <Carousel
                                activeIndex={activeIndex}
                                next={this.next}
                                previous={this.previous}
                                >
                                <CarouselIndicators items={images} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                                {slides}
                                <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                                <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                            </Carousel>
                        </div>
                    ):
                    (
                        <div style={{padding: '20px', fontSize: '18px', textAlign: 'center'}} >Nothing To Show</div>
                    )
                }
            </div>
        )
    }
}


