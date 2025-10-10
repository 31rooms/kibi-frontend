'use client';

import { useState } from 'react';
import { Toggle, ToggleWithText, Checkbox, Calendar, CalendarMobile, Modal } from '@/components/ui';

export default function TestInteractive() {
  // Toggle states
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(true);
  const [toggle3, setToggle3] = useState(false);
  const [toggle4, setToggle4] = useState(false);
  const [toggle5, setToggle5] = useState(false);
  // ToggleWithText states
  const [toggleText1, setToggleText1] = useState(false);
  const [toggleText2, setToggleText2] = useState(false);
  const [toggleText3, setToggleText3] = useState(false);
  const [toggleText4, setToggleText4] = useState(false);

  // Checkbox states
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState<boolean | 'indeterminate'>('indeterminate');
  const [check4, setCheck4] = useState(false);
  const [check5, setCheck5] = useState(true);

  // Calendar states
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [mobileDate, setMobileDate] = useState<Date | undefined>(new Date());

  // Modal states
  const [modalInfo, setModalInfo] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalAlert, setModalAlert] = useState(false);
  const [modalWarning, setModalWarning] = useState(false);
  const [modalInfoSmall, setModalInfoSmall] = useState(false);
  const [modalSuccessSmall, setModalSuccessSmall] = useState(false);
  const [modalAlertSmall, setModalAlertSmall] = useState(false);
  const [modalWarningSmall, setModalWarningSmall] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Interactive Components - Kibi Design System
      </h1>

      {/* Toggle Component */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Toggle - 9 Estilos de Figma</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Style 1 */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 1 (Default)</h3>
            <Toggle
              style="1"
              checked={toggle1}
              onCheckedChange={setToggle1}
            />
            <p className="mt-2 text-xs text-grey-500">
              {toggle1 ? 'ON' : 'OFF'}
            </p>
          </div>

          {/* Style 2 */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 2</h3>
            <Toggle
              style="2"
              checked={toggle2}
              onCheckedChange={setToggle2}
            />
            <p className="mt-2 text-xs text-grey-500">
              {toggle2 ? 'ON' : 'OFF'}
            </p>
          </div>

          {/* Style 3 */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 3</h3>
            <Toggle
              style="3"
              checked={toggle3}
              onCheckedChange={setToggle3}
            />
            <p className="mt-2 text-xs text-grey-500">
              {toggle3 ? 'ON' : 'OFF'}
            </p>
          </div>

          {/* Style 4 */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 4</h3>
            <Toggle
              style="4"
              checked={toggle4}
              onCheckedChange={setToggle4}
            />
            <p className="mt-2 text-xs text-grey-500">
              {toggle4 ? 'ON' : 'OFF'}
            </p>
          </div>

          {/* Style 5 */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 5</h3>
            <Toggle
              style="5"
              checked={toggle5}
              onCheckedChange={setToggle5}
            />
            <p className="mt-2 text-xs text-grey-500">
              {toggle5 ? 'ON' : 'OFF'}
            </p>
          </div>

          {/* Style 6 */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 6</h3>
            <Toggle
              style="6"
              checked={toggle1}
              onCheckedChange={setToggle1}
            />
          </div>

          {/* Style 7 */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 7</h3>
            <Toggle
              style="7"
              checked={toggle2}
              onCheckedChange={setToggle2}
            />
          </div>

          {/* Style 8 */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 8</h3>
            <Toggle
              style="8"
              checked={toggle3}
              onCheckedChange={setToggle3}
            />
          </div>

          {/* Style 9 */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 9</h3>
            <Toggle
              style="9"
              checked={toggle4}
              onCheckedChange={setToggle4}
            />
          </div>

          {/* Disabled */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Disabled</h3>
            <Toggle style="1" checked={true} disabled />
          </div>
        </div>

        {/* Toggle With Text Example */}
        <div className="mt-8 border rounded-lg p-6 bg-grey-50">
          <h3 className="text-lg font-medium mb-4">Settings Example</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-grey-900">Auto Save Off</p>
                <p className="text-sm text-grey-600">Automatically save changes</p>
              </div>
              <Toggle
                checked={toggle1}
                onCheckedChange={setToggle1}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-grey-900">Light mode</p>
                <p className="text-sm text-grey-600">Toggle between light and dark mode</p>
              </div>
              <Toggle
                checked={toggle2}
                onCheckedChange={setToggle2}
                label={toggle2 ? 'Dark mode' : 'Light mode'}
                labelPosition="left"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-grey-900">Switch Version</p>
                <p className="text-sm text-grey-600">Enable new features</p>
              </div>
              <Toggle
                style="4"
                checked={toggle3}
                onCheckedChange={setToggle3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ToggleWithText Component */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Toggle With Text - 4 Estilos de Figma</h2>

        <div className="space-y-8">
          {/* Style 1 */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 1 - Simple with text</h3>
            <ToggleWithText
              style="1"
              checked={toggleText1}
              onCheckedChange={setToggleText1}
              offLabel="Auto Saver Off"
              onLabel="Auto Saver On"
            />
          </div>

          {/* Style 2 */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 2 - Light/Dark mode cards</h3>
            <ToggleWithText
              style="2"
              checked={toggleText2}
              onCheckedChange={setToggleText2}
            />
          </div>

          {/* Style 3 */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 3 - Light/Dark toggle</h3>
            <ToggleWithText
              style="3"
              checked={toggleText3}
              onCheckedChange={setToggleText3}
            />
          </div>

          {/* Style 4 */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 4 - Switch Version buttons</h3>
            <ToggleWithText
              style="4"
              checked={toggleText4}
              onCheckedChange={setToggleText4}
            />
          </div>
        </div>

        {/* Examples */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-medium mb-4">Settings Panel</h3>
            <div className="space-y-4">
              <ToggleWithText
                style="1"
                checked={toggleText1}
                onCheckedChange={setToggleText1}
                offLabel="Notifications Off"
                onLabel="Notifications On"
              />
              <ToggleWithText
                style="3"
                checked={toggleText3}
                onCheckedChange={setToggleText3}
              />
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-medium mb-4">Theme Selector</h3>
            <div className="space-y-4">
              <ToggleWithText
                style="2"
                checked={toggleText2}
                onCheckedChange={setToggleText2}
              />
              <ToggleWithText
                style="4"
                checked={toggleText4}
                onCheckedChange={setToggleText4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Checkbox Component */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Checkbox - 5 Estilos de Figma</h2>

        <div className="space-y-8">
          {/* Style 1 - Square with inner square */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 1 - Square with inner square fill</h3>
            <div className="flex gap-6">
              <Checkbox
                style="1"
                checked={check1}
                onCheckedChange={(value) => setCheck1(value as boolean)}
                label="Unchecked → Inner square"
              />
              <Checkbox
                style="1"
                checked={check3}
                onCheckedChange={setCheck3}
                label="Indeterminate state"
              />
            </div>
          </div>

          {/* Style 2 - Default with checkmark */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 2 - Square with checkmark (default)</h3>
            <div className="flex gap-6">
              <Checkbox
                style="2"
                checked={check2}
                onCheckedChange={(value) => setCheck2(value as boolean)}
                label="Classic checkbox"
              />
              <Checkbox
                style="2"
                checked={check3}
                onCheckedChange={setCheck3}
                label="Indeterminate state"
              />
            </div>
          </div>

          {/* Style 3 - Light background with green check */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 3 - Light background with green check</h3>
            <div className="flex gap-6">
              <Checkbox
                style="3"
                checked={check1}
                onCheckedChange={(value) => setCheck1(value as boolean)}
                label="Soft background style"
              />
              <Checkbox
                style="3"
                checked={check3}
                onCheckedChange={setCheck3}
                label="Indeterminate state"
              />
            </div>
          </div>

          {/* Style 4 - Circle filled */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 4 - Circle that fills solid</h3>
            <div className="flex gap-6">
              <Checkbox
                style="4"
                checked={check4}
                onCheckedChange={(value) => setCheck4(value as boolean)}
                label="Radio-like checkbox"
              />
              <Checkbox
                style="4"
                checked={check3}
                onCheckedChange={setCheck3}
                label="Indeterminate state"
              />
            </div>
          </div>

          {/* Style 5 - Circle with inner circle */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Style 5 - Circle with inner circle</h3>
            <div className="flex gap-6">
              <Checkbox
                style="5"
                checked={check5}
                onCheckedChange={(value) => setCheck5(value as boolean)}
                label="Radio button style"
              />
              <Checkbox
                style="5"
                checked={check3}
                onCheckedChange={setCheck3}
                label="Indeterminate state"
              />
            </div>
          </div>

          {/* Disabled states */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Disabled States</h3>
            <div className="flex gap-6">
              <Checkbox
                style="2"
                checked={true}
                disabled
                label="Disabled checked"
              />
              <Checkbox
                style="2"
                checked={false}
                disabled
                label="Disabled unchecked"
              />
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-medium mb-4">Task List (Style 2)</h3>
            <div className="space-y-3">
              <Checkbox
                style="2"
                checked={check1}
                onCheckedChange={(value) => setCheck1(value as boolean)}
                label="Complete project documentation"
              />
              <Checkbox
                style="2"
                checked={check2}
                onCheckedChange={(value) => setCheck2(value as boolean)}
                label="Review pull requests"
              />
              <Checkbox
                style="2"
                checked={check3}
                onCheckedChange={setCheck3}
                label="Update design system"
              />
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-medium mb-4">Settings (Style 5)</h3>
            <div className="space-y-3">
              <Checkbox
                style="5"
                checked={check4}
                onCheckedChange={(value) => setCheck4(value as boolean)}
                label="Enable notifications"
              />
              <Checkbox
                style="5"
                checked={check5}
                onCheckedChange={(value) => setCheck5(value as boolean)}
                label="Auto-save changes"
              />
              <Checkbox
                style="5"
                checked={false}
                onCheckedChange={() => {}}
                label="Beta features"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Component */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Calendar</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Desktop Calendar */}
          <div>
            <h3 className="text-lg font-medium mb-4">Desktop Calendar</h3>
            <Calendar
              selected={selectedDate}
              onSelect={setSelectedDate}
              onRemove={() => setSelectedDate(undefined)}
              onDone={() => console.log('Selected:', selectedDate)}
            />
            {selectedDate && (
              <p className="mt-4 text-sm text-grey-600">
                Selected: {selectedDate.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>

          {/* Calendar Without Actions */}
          <div>
            <h3 className="text-lg font-medium mb-4">Simple Calendar</h3>
            <Calendar
              selected={selectedDate}
              onSelect={setSelectedDate}
              showActions={false}
            />
          </div>
        </div>
      </section>

      {/* Calendar Mobile Component */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Calendar Mobile</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mobile Calendar Default */}
          <div>
            <h3 className="text-lg font-medium mb-4">Mobile Calendar - Default</h3>
            <CalendarMobile
              selected={mobileDate}
              onSelect={setMobileDate}
              onCancel={() => console.log('Cancelled')}
              onAccept={() => console.log('Accepted:', mobileDate)}
            />
            {mobileDate && (
              <p className="mt-4 text-sm text-grey-600">
                Selected: {mobileDate.toLocaleDateString('es-ES')}
              </p>
            )}
          </div>

          {/* Mobile Calendar Compact */}
          <div>
            <h3 className="text-lg font-medium mb-4">Mobile Calendar - Compact</h3>
            <CalendarMobile
              selected={mobileDate}
              onSelect={setMobileDate}
              variant="compact"
              onCancel={() => console.log('Cancelled')}
              onAccept={() => console.log('Accepted:', mobileDate)}
            />
          </div>
        </div>
      </section>

      {/* Modal Component */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Modal - 4 Estados × 2 Tamaños</h2>

        <div className="space-y-8">
          {/* Default Size Modals */}
          <div>
            <h3 className="text-lg font-medium mb-4">Default Size</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setModalInfo(true)}
                className="px-4 py-2 bg-[#0074f0] text-white rounded-lg hover:bg-[#0062cc] transition-colors"
              >
                Information
              </button>
              <button
                onClick={() => setModalSuccess(true)}
                className="px-4 py-2 bg-[#1da534] text-white rounded-lg hover:bg-[#178f2a] transition-colors"
              >
                Success
              </button>
              <button
                onClick={() => setModalAlert(true)}
                className="px-4 py-2 bg-[#df0707] text-white rounded-lg hover:bg-[#c00606] transition-colors"
              >
                Alert
              </button>
              <button
                onClick={() => setModalWarning(true)}
                className="px-4 py-2 bg-[#ffc800] text-white rounded-lg hover:bg-[#e8b600] transition-colors"
              >
                Warning
              </button>
            </div>
          </div>

          {/* Small Size Modals */}
          <div>
            <h3 className="text-lg font-medium mb-4">Small Size</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setModalInfoSmall(true)}
                className="px-4 py-2 bg-[#0074f0] text-white rounded-lg hover:bg-[#0062cc] transition-colors"
              >
                Information (Small)
              </button>
              <button
                onClick={() => setModalSuccessSmall(true)}
                className="px-4 py-2 bg-[#1da534] text-white rounded-lg hover:bg-[#178f2a] transition-colors"
              >
                Success (Small)
              </button>
              <button
                onClick={() => setModalAlertSmall(true)}
                className="px-4 py-2 bg-[#df0707] text-white rounded-lg hover:bg-[#c00606] transition-colors"
              >
                Alert (Small)
              </button>
              <button
                onClick={() => setModalWarningSmall(true)}
                className="px-4 py-2 bg-[#ffc800] text-white rounded-lg hover:bg-[#e8b600] transition-colors"
              >
                Warning (Small)
              </button>
            </div>
          </div>
        </div>

        {/* Modal Instances */}
        <Modal
          open={modalInfo}
          onOpenChange={setModalInfo}
          state="information"
          size="default"
          title="Your Message Sent Successfully"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since"
          onConfirm={() => console.log('Information confirmed')}
        />
        <Modal
          open={modalSuccess}
          onOpenChange={setModalSuccess}
          state="success"
          size="default"
          title="Deactivate Your Account"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum been."
          onConfirm={() => console.log('Success confirmed')}
        />
        <Modal
          open={modalAlert}
          onOpenChange={setModalAlert}
          state="alert"
          size="default"
          title="Deactivate Your Account"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum been."
          onConfirm={() => console.log('Alert confirmed')}
        />
        <Modal
          open={modalWarning}
          onOpenChange={setModalWarning}
          state="warning"
          size="default"
          title="Deactivate Your Account"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum been."
          onConfirm={() => console.log('Warning confirmed')}
        />
        <Modal
          open={modalInfoSmall}
          onOpenChange={setModalInfoSmall}
          state="information"
          size="small"
          title="Your Message Sent Successfully"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          onConfirm={() => console.log('Info small confirmed')}
        />
        <Modal
          open={modalSuccessSmall}
          onOpenChange={setModalSuccessSmall}
          state="success"
          size="small"
          title="Deactivate Your Account"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          onConfirm={() => console.log('Success small confirmed')}
        />
        <Modal
          open={modalAlertSmall}
          onOpenChange={setModalAlertSmall}
          state="alert"
          size="small"
          title="Deactivate Your Account"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          onConfirm={() => console.log('Alert small confirmed')}
        />
        <Modal
          open={modalWarningSmall}
          onOpenChange={setModalWarningSmall}
          state="warning"
          size="small"
          title="Deactivate Your Account"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          onConfirm={() => console.log('Warning small confirmed')}
        />
      </section>

      {/* Combined Example */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Combined Example</h2>

        <div className="border rounded-lg p-6 bg-white">
          <h3 className="text-lg font-medium mb-6">Create Event Form</h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Event Date</label>
              <CalendarMobile
                selected={mobileDate}
                onSelect={setMobileDate}
                variant="compact"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Notifications</label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Checkbox
                    checked={check1}
                    onCheckedChange={(value) => setCheck1(value as boolean)}
                    label="Email notification"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Checkbox
                    checked={check2}
                    onCheckedChange={(value) => setCheck2(value as boolean)}
                    label="Push notification"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Settings</label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-grey-700">All day event</span>
                  <Toggle
                    checked={toggle1}
                    onCheckedChange={setToggle1}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-grey-700">Repeat event</span>
                  <Toggle
                    checked={toggle2}
                    onCheckedChange={setToggle2}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button className="flex-1 px-4 py-2 text-sm font-medium text-grey-700 bg-white border border-grey-300 hover:bg-grey-50 rounded-lg transition-colors">
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-green hover:bg-[#7da855] rounded-lg transition-colors">
                Create Event
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
